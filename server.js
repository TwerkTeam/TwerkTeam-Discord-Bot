require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const discord = require('./helpers/discord_manager.js');
const server = express();

// Server setup //
server.use(bodyParser.json());
server.listen(process.env.PORT || 8080, function() {
    if (process.env.PORT) {
        console.log('***** Server listening to port '+process.env.PORT+' *****');
    } else {
        console.log('***** Server listening to port 8080 *****');
    }
});

// Keep Bot Alive //
server.get('/', (request, response) => {
    console.log('Stayin Alive.');
    response.send('Stayin Alive.');
});