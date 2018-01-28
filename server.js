require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var discord = require('./helpers/discord_manager.js');
var server = express();

// Server setup //
// As of now this is not needed... Keeping here just in case //
/* server.use(bodyParser.json());
server.listen(process.env.PORT, '0.0.0.0', function() {
    console.log('***** Server listening to port 8080 *****');
}); */