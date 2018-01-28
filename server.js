require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var discord = require('./helpers/discord_manager.js');
var server = express();

// Server setup //
server.use(bodyParser.json());
server.listen(process.env.PORT || 8080, function() {
    if (process.env.PORT) {
        console.log('***** Server listening to port '+process.env.PORT+' *****');
    } else {
        console.log('***** Server listening to port 8080 *****');
    }
});