const Discord = require('discord.js');
const https = require('https');
const client = new Discord.Client();
const generator = require('../helpers/html_generator.js');
const xss = require('xss');
const fs = require('fs');
const http = require('http');

//-- Commands --//
const cmdManager = require('../helpers/commands.js');
const config = require('../config.js');

// Get Discord client ready //
client.on('ready', () => {
    console.log('Discord client is ready.');
    // Keep Heroku Server On //
    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'production') {
        console.log('Ping timer is set.');
        setInterval(function() { 
            http.get(process.env.HEROKU_URL);
        }, (1000 * 60 * 20));
    }
    
    // Set Bot Commands //
    console.log('Setting bot commands...');
    cmdManager.setCommands(client);
});


client.on('message', message => {
    if (message.channel.id === process.env.DISCORD_CHANNEL_ID && !message.author.bot) {
        /* 
            EXAMPLE:
            !help someArgsAfter
        */
        
        // Create temp prop to manipulate //
        var tempContent = message.content.toLowerCase();
        
        // Check for help command //
        if (tempContent.startsWith('!help')) {
            console.log('In !help commands.')
            var command = client.commands.get('help');
            if (command) command.run(client, message);
        }        
    }
});

/* client.on('message', message => {
    // Channel id for bot-test-channel in adilanchian server//
    if (message.channel.id === process.env.DISCORD_CHANNEL_ID && !message.author.bot) {
        /* 
            Get content of message [id: content]
            channelName
            bio
            streamUrl
            image
            *There should be an image attached with this message as well*
        
        
        // Clone & lower //
        var originalContent = xss.escapeHtml(cloneString(message.content));
        var tempContent = message.content.toLowerCase();
        var memberAdded = false;
        var inImageUpdate = false;
        
        // Get Help Command //
        if (tempContent.startsWith('!help')) {
            console.log('In help section.');
            // List commands //
            var helpMessageP1 = 
            ` welcome to the official partner program! I'm here to showcase your accomplishment on our website.
            Here is the perfect command to get started:
            \`\`\`Channel Name: MyChannelName\nBio: MyBio\nStream Link: http://www.MyStreamLink.com\n*Attach Image*\`\`\``;
            
            var helpMessageP2 = 
            ` already a part of the TwerkTeam site? Let me help you update your content by using one of these commands:\n
            \`!updateChannel MyUpdatedChannel\` ---> Update your channel name.
            \`!updateBio MyUpdatedBio\` ---> Update your bio.
            \`!updateStreamLink MyUpdatedStreamLink\` ---> Update your stream url.
            \`!updateImage *Attach Image*\` ---> Update your image.
            \`!help\` ---> Get list of commands.`
            
            message.reply(helpMessageP1);
            message.reply(helpMessageP2);
            
            return;
        }
        
        // Get list of members from web server //
        generator.getCurrentMembers((didFinish) => {
            
            if (didFinish) {
                // Check to see if part of uploads file //
                fs.readFile('./assets/listed-members.txt', 'utf8', (memberFileError, data) => {
                    if (memberFileError) throw memberFileError;
                    
                    console.log('CURRENT DISCORD USER: '+message.author.username);
                    
                    if (data.indexOf(message.author.username) !== -1) {
                        console.log(message.author.username+' is already on the site.');
                        memberAdded = true;
                        
                        // Allow update commands only //
                        if (tempContent.startsWith('!updatechannel')) {
                            console.log('User updating channel...');
                            
                            var commandLen = '!updatechannel'.length;
                            originalContent = originalContent.slice(commandLen).trim();
                            
                            // !updateChannel //
                            if (originalContent !== '') {
                                console.log(originalContent);
                                
                                // Bundle up object //
                                var updateData = {
                                    'discordUsername': message.author.username,
                                    'command': 'channelName',
                                    'content': originalContent
                                }
                                
                                generator.updateMember(updateData);
                                message.reply(' your channel name has been changed to: `'+originalContent+'`!');
                                return;
                            } else {
                                message.reply(' you forget to add a new channel name!\nPlease use command `!updateChannel myNewChannelName`');
                                return;
                            }
                        } else if (tempContent.startsWith('!updatebio')) {
                            // !updateBio //
                            console.log('User updating bio...');
                            
                            var commandLen = '!updatebio'.length;
                            originalContent = originalContent.slice(commandLen).trim();
                            
                            if (originalContent !== '') {
                                console.log(originalContent);
                                
                                // Bundle up object //
                                var updateData = {
                                    'discordUsername': message.author.username,
                                    'command': 'bio',
                                    'content': originalContent
                                }
                                
                                generator.updateMember(updateData);
                                
                                message.reply(' your bio has been changed to: `'+originalContent+'`!');
                                return;
                            } else {
                                message.reply(' you forget to add a new bio!\nPlease use command `!updateBio myNewBio`');
                                return;
                            }
                        } else if (tempContent.startsWith('!updatestreamlink')) {
                            // !updateStreamLink //
                            console.log('User updating stream link...');
                            
                            var commandLen = '!updatestreamlink'.length;
                            originalContent = originalContent.slice(commandLen).trim();

                            if (originalContent !== '') {
                                console.log(originalContent);

                                // Bundle up object //
                                var updateData = {
                                    'discordUsername': message.author.username,
                                    'command': 'streamLink',
                                    'content': urlGenerator(originalContent)
                                }
                                generator.updateMember(updateData);
                                
                                message.reply(' your stream link has been changed to: '+originalContent);
                                return;
                            } else {
                                message.reply(' you forget to add a new stream link!\nPlease use command `!updateStreamLink myNewLink`');
                                return;
                            }
                        } else if (tempContent.startsWith('!updateimage')) {
                            console.log('User updating image...');
                            
                            // !updateImage //
                            var imageAttachments = message.attachments;

                            if (imageAttachments.size === 0) {
                                console.log('No image attached.');
                                message.reply(' you forgot to attach an image!\nPlease use command `!updateImage` and attach an image');
                                return;
                            } else {
                                inImageUpdate = true;
                                imageAttachments.forEach((attachment) => {
                                    var attachmentUrl = attachment.url;
                                    
                                    // Check to see if image, else send error message //
                                    if (attachmentUrl.search('.png') !== -1 ||
                                        attachmentUrl.search('.jpeg') !== -1 ||
                                        attachmentUrl.search('.jpg') !== -1) {
                                            console.log('Image url: '+attachmentUrl);
                                            
                                            // Check width/height //
                                            if (isValidImageSize(attachment.width, attachment.height)) {
                                                // Bundle up object //
                                                var updateData = {
                                                    'discordUsername': message.author.username,
                                                    'command': 'image',
                                                    'content': attachmentUrl
                                                }
                                                
                                                // TODO: ADD PROMISES FOR BOT REPLY! //
                                                generator.updateMember(updateData);
                                                message.reply(' your image has been updated to: `'+attachment.filename+'`')
                                                return;
                                            } else {
                                                message.reply(' your image was a bit to small!\nPlease upload an image with a minimum size of 500x500');
                                                return;
                                            }
                                    } else {
                                        console.log('Attachment is not an image.');
                                        message.reply(' please use .png, .jpeg, .jpg');
                                        return;
                                    }
                                });
                            }
                        }
                        
                        if (!inImageUpdate) {
                            message.reply(' looks like you are already on twerk.team!\nPlease use a valid update command.');
                        }
                    } else {
                        // Add path //
                        if (memberAdded) {
                            message.reply(' looks like you are already on twerk.team!\nPlease use a valid update command.');
                            return;
                        }
                        
                        // Get content and split //
                        var contentArray = message.content.split('\n');
                        var channelName = '';
                        var bio = '';
                        var streamUrl = '';
                        
                        var imageProvided = false;
                        
                        console.log(contentArray);
                        
                        //-- MAD PROPS TO KociQQ --//
                        // Start by searching for respected Ids //
                        for (var i = 0; i < contentArray.length; i++) {
                            var cloned = cloneString(contentArray[i]);
                            var temp = contentArray[i].toLowerCase();
                            
                            // Channel Name //
                            if (channelName === '' && temp.search('channel name') !== -1) {
                                var charLen = 'channel name:'.length;
                                cloned = cloned.slice(charLen).trim()
                                
                                console.log('Channel name has been found');
                                
                                // This should return our content //
                                channelName = cloned;
                                continue;
                            }
                            
                            // Bio //
                            if (bio === '' && temp.search('bio') !== -1) {
                                var charLen = 'bio:'.length;
                                cloned = cloned.slice(charLen).trim()
                                
                                console.log('Bio has been found');
                                temp = temp.split('bio:');
                                
                                // This should return our content //
                                bio = cloned;
                                continue;
                            }
                            
                            // streamUrl //
                            if (streamUrl === '' && temp.search('stream link') !== -1) {
                                var charLen = 'stream link:'.length;
                                cloned = cloned.slice(charLen).trim()
                                
                                console.log('StreamUrl has been found');
                                temp = temp.split('stream link:');
                                
                                // This should return our content //
                                streamUrl = cloned;
                                continue;
                            }
                        }
                        
                        // Check to see if all content was provided //
                        console.log('Checking to see if all content was provided...');
                        
                        if (channelName === '' && bio === '' && streamUrl === '') {
                            message.reply(' try using this format:\n```Channel Name:\nBio:\nStream Link:```\n');
                            return;
                        }
                        
                        if (channelName === '') {
                            message.reply(' you forgot to provide your channel name!\nTry using this format:\n```Channel Name:\nBio:\nStream Link:```\n');
                            return;
                        }
                        
                        if (bio === '') {
                            message.reply(' you forgot to provide your bio!\nTry using this format:\n```Channel Name:\nBio:\nStream Link:```\n');
                            return;
                        }
                        
                        if (streamUrl === '') {
                            message.reply(' you forgot to provide your stream link!\nTry using this format:\n```Channel Name:\nBio:\nStream Link:```\n');
                            return;
                        }
                        
                        console.log('Channel Name: '+channelName);
                        console.log('Bio: '+bio);
                        console.log('Stream Url: '+streamUrl);
                        console.log('Checking for attachments...');
                        
                        // Get attachment from message, check for image //
                        var imageAttachments = message.attachments;
                        
                        if (imageAttachments.size === 0) {
                            console.log('Image is not attached.');
                            message.reply(' looks like you didn\'t attach an image!\nPlease submit again with an image that has a minimum size of 500x500.');
                            return;
                        }
                        
                        imageAttachments.forEach((attachment) => {
                            var attachmentUrl = attachment.url;
                                    
                            // Check to see if image, else send error message //
                            if (attachmentUrl.search('.png') !== -1 ||
                            attachmentUrl.search('.jpeg') !== -1 ||
                            attachmentUrl.search('.jpg') !== -1) {
                                            
                                // We have an image attachment //
                                imageProvided = true;
                                
                                // Check width/height //
                                if (isValidImageSize(attachment.width, attachment.height)) {
                                    // Creator Member Object //
                                    let twerkMember = {
                                        'discordUsername': message.author.username,
                                        'channelName': channelName,
                                        'bio': bio,
                                        'streamLink': urlGenerator(streamUrl),
                                        'imageUrl': attachment.url 
                                    }
                                    
                                    // Time to create HTML //
                                    generator.createHtml(twerkMember)
                                    
                                    // Write channleName to text file for later checks //
                                    fs.appendFile('./assets/listed-members.txt', message.author.username+'\n', error => {
                                        if (error) throw error;
                                        console.log('Member has been written to listed-members file');
                                    });
                                    
                                    message.reply(' thanks for your submission!\nKeep Twerkin.');
                                    return;
                                } else {
                                    message.reply(' your image was a bit to small!\nPlease upload an image with a minimum size of 500x500');
                                    return;
                                }
                            } else {
                                console.log('Attachment is not an image.');
                                message.reply(' please use .png, .jpeg, .jpg');
                                return;
                            }
                            
                            if (!imageProvided) {
                                console.log('There were no attachments.');
                                message.reply(' looks like you didn\'t attach an image!\nPlease submit again.');
                            }
                        });
                    }
                });
            }
        });
    }
}); */

//-- MAD PROPS TO KociQQ --//
function cloneString(text) {
    return (' ' + text).slice(1)
}

//-- Valid Image Size --//
function isValidImageSize(imageWidth, imageHeight) {
    if (imageWidth < 500 || imageHeight < 500) {
        return false;
    }
    
    return true; 
}

//-- Valid URL --//
function urlGenerator(url) {
    // Check to see if there is a valid url path () //
    if (url.startsWith('http://') || url.startsWith('https://')) {
        console.log('Valid url, we dont need nothing!');
        return url;
    }
    
    console.log('Non-valid Url... Creating new one.');
    return 'http://'+url;
}

//-- Login with token --//
client.login(process.env.BOT_TOKEN);