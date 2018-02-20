# Twerkinator-Discord-Bot
TwerkTeam Discord Bot that will help facilitate automation throughout the server.

## Current Features
- Automatically update twerk.team website streamer gallery section automatically by feeding information to the bot on the TwerkTeam Discord Server.

## Getting Started - Local
This bot requires you have a `.env` file to read in the proper keys needed. This file is in the `.gitignore` file and will not be committed to the repo if you make
changes!

The keys needed are:<br>
`NODE_ENV=local`<br>
`DISCORD_CHANNEL_ID` (Channel ID you want the bot to listen to)<br>
`BOT_TOKEN` (Token from Discord)<br>
`FTP_HOST` (SFTP host name)<br>
`FTP_USER` (SFTP username)<br>
`FTP_PW` (SFTP PW)<br>
`FTP_FILEPATH` (FTP file path depending on dev or production)<br>
`HEROKU_URL` (Heroku url to ping server to keep alive)<br>
`FTP_FILEPATH_GALLERY` (FTP file path to streamergallery file depending on dev or production)<br>
`FTP_FILEPATH_MEMBERS` (FTP file path to listed-members file depending on dev or production)

## Run The Bot
Open a command line in the directory of the bot and run the command `npm install && npm start`
This should download all the node modules needed and start the bot. From there run the bot and test out the commands GL HF!

If you are developing for the TwerkTeam please contact Alec (adilanchian) for the
proper dev keys needed for the SFTP info. TwerkTeam Dev Site: https://dev.twerk.team

## Getting Started - Development (Heroku)
We are hosting this bot on Heroku. Tests on here should be done only when ready to bring in outside testers!<br>
In order to get your latest code on Heroku, all you need to do is push your code to your feature branch and then merge that into the `development` branch on Github. This will automatically trigger a build on the `twerkinator-dev` Heroku server.<br> 
Currently, the test channel for Twerkinator is being hidden within the TwerkTeam Discord Server. The channel in there is called #twerkinator-test and will be shown when testing is needed!

## Getting Started - Production (Heroku)
We are hosting this bot on Heroku. This should be your working bot! No unstable code should be pushed here.<br>
In order to get your latest code on Heroku, all you need to do is push your code to your feature branch and then merge that into the `development` branch on Github. All testing should happen there and when ready, merge the bot into the `master` branch. This will automatically trigger a build on the `twerkinator-production` Heroku server.<br> 
At this point the bot should be live and able to use within the TwerkTeam Discord on channel #streamer-gallery-signup (Assuming the users are Official Partners)
