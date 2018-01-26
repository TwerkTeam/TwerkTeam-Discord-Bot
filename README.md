# TwerkTeam-Discord-Bot
TwerkTeam Discord Bot that will help facilitate automation throughout the server

## Getting Started - Dev
This bot requires you have a `.env` file to read in the proper keys needed. This
file is in the gitignore file and will not be committed to the repo if you make
changes!
The keys needed are:

`NODE_ENV=dev`
`DISCORD_CHANNEL_ID` (Channel ID you want the bot to listen to)
`BOT_TOKEN` (Token from Discord)
`FTP_HOST` (SFTP host name)
`FTP_USER` (SFTP username)
`FTP_PW` (SFTP PW)

If you are developing for the TwerkTeam please contact Alec (adilanchian) for the
proper dev keys needed for the SFTP info. TwerkTeam Dev Site: https://dev.twerk.team

## Run The Bot
Open a command line in the directory of the bot and run the command `npm install && npm start`
This should download all the node modules needed and start the bot. From there run 
the bot and test out the commands GL HF!