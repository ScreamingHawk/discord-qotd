'use strict';

const fetch = require('node-fetch')
const dotty = require('dotty')

const discordjs = require('discord.js')
const discord = new discordjs.Client()

const channelId = process.env.discordChannel || "478506811238907904"

const maxQuestionTest = 10

module.exports.qotd = async (event, context, callback) => {
	// Login to discord
	try {
		await discord.login(process.env.discordToken)
	} catch (err) {
		console.error(`Discord login failed: ${err}`)
		console.log(`Token: ${process.env.discordToken}`)
		return callback("Discord login failed")
	}

	// Get channel
	const channel = discord.channels.get(channelId)
	if (!channel) {
		console.error(`Invalid channel ${channelId}`)
		return callback(`Invalid channel ${channelId}`)
	}

	// Get QOTD from reddit
	let q = null
	try {
		const resp = await fetch(`https://reddit.com/r/askreddit/.json?limit=${maxQuestionTest}`)
		const data = await resp.json()
		// Get the first result that doesn't contain "reddit" or start with "PSA:" or contains "people who" and ends with a ?
		for (let i = 0; i < maxQuestionTest; i++) {
			q = dotty.get(data, `data.children.${i}.data.title`)
			if (!q.match(/reddit/i) && !q.match(/people\swho/i) && !q.match(/^PSA:/i) && q.match(/.*\?$/)) {
				break
			}
		}
	} catch (err) {
		console.error(`Error calling Reddit: ${err}`)
		return callback(`Error calling Reddit: ${err}`)
	}

	if (!q) {
		console.error("Unable to get question from Reddit")
		return callback("Unable to get question from Reddit")
	}
	// Format
	q = q.replace(/\[.*\]/, '') // Strip tags
		.trim() // Remove whitespace
		.replace(/^\w/, c => c.toUpperCase()) // Uppercase first character

	// Send it
	console.debug('Sending QOTD')
	await channel.send('```' + q + '```')
	console.debug('QOTD sent')

	// Logout of discord
	try {
		await discord.destroy()
	} catch (err) {
		console.error(`Discord logout failed: ${err}`)
		// Fail over, still a success
	}

	return callback()

}
