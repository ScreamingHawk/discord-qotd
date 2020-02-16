# Discord QOTD

A serverless cron job to post the current best AskReddit post to a discord channel, daily. 

QOTD = Question Of The Day

## Set up

Install [serverless](https://serverless.com/framework/docs/providers/aws/guide/installation/).
Configure your [AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/).
Create a [discord bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html##creating-your-bot).

Copy the example environment variables file.

```sh
cp env.example .env
```

Modify the values in the `.env` file with your values where:
* `DISCORD_TOKEN` is your discord bot's token
* `DISCORD_CHANNEL` is the default channel id for your notifications

## Deployment

```sh
serverless deploy --aws-profile default
```

### Test

```sh
sls invoke -f qotd --aws-profile default
```

### Logs

```sh
sls logs -f qotd --aws-profile default
```

## Test locally

Replace `XXX` with your env values.

```sh
sls invoke local -f qotd -e discordToken=XXX -e discordChannel=XXX
```

## Credits

[Michael Standen](https://michael.standen.link)

This software is provided under the [MIT License](https://tldrlegal.com/license/mit-license) so it's free to use so long as you give me credit.