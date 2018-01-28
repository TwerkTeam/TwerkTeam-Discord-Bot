const Discord = require('discord.js');
const https = require('https');
const client = new Discord.Client();
const generator = require('../helpers/html_generator.js');
const xss = require('xss');
const fs = require('fs');
const http = require('http');

// Get Discord client ready //
client.on('ready', () => {
    console.log('Discord client is ready.');
    // Keep Heroku Server On //
    if (process.env.NODE_ENV === 'dev') {
        setInterval(function() { 
            http.get('http://twerkteam-bot-dev.herokuapp.com');
        }, 3000);
    }
});

// Test //
client.on('message', message => {
    // Channel id for bot-test-channel in adilanchian server//
    if (message.channel.id === process.env.DISCORD_CHANNEL_ID && !message.author.bot) {
        /* 
            Get content of message [id: content]
            channelName
            bio
            streamUrl
            image
            *There should be an image attached with this message as well*
        */
        
        // Clone & lower //
        var originalContent = xss.escapeHtml(cloneString(message.content));
        var tempContent = message.content.toLowerCase();
        var memberAdded = false;
        var inImageUpdate = false;
        
        // Get Help Command //
        if (tempContent.startsWith('!help')) {
            console.log('In help section.');
            // List commands //
            var helpMessage = `Welcome to the TwerkTeam! I'm here to help you be part of our website!\n
                To get started use one of these commands:\n
                Channel Name: MyChannelName
                Bio: MyBio
                Stream Link: http://www.MyStreamLink.com
                *Attach Image*\n
                ---------------------------\n
                !updateChannel MyUpdatedChannel ---> Change your channel name.
                !updateBio MyUpdatedBio ---> Change your bio.
                !updateStreamLink MyUpdatedStreamLink ---> Change your stream url.
                !updateImage *Attach Image* ---> Change your image.
                !help ---> Get list of commands.
            `;
            message.reply(helpMessage);
            return;
        }
        
        // Check to see if part of uploads file //
        fs.readFile('./assets/listed-members.txt', 'utf8', (memberFileError, data) => {
            if (memberFileError) throw memberFileError;
            
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
                            'content': originalContent
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
                    var imageAttachment = message.attachments;

                    if (imageAttachment.size === 0) {
                        console.log('No image attached.');
                        message.reply(' you forgot to attach an image!\nPlease use command `!updateImage` and attach an image');
                        return;
                    } else {
                        inImageUpdate = true;
                        imageAttachment.forEach((attachment) => {
                            var attachmentUrl = attachment.url;
                            
                            // Check to see if image, else send error message //
                            if (attachmentUrl.search('.png') !== -1 ||
                                attachmentUrl.search('.jpeg') !== -1 ||
                                attachmentUrl.search('.jpg') !== -1) {
                                    console.log('Image url: '+attachmentUrl);
                                    
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
                                console.log('Attachment is not an image.');
                                message.reply(' please use .png, .jpeg, .jpg');
                                return;
                            }
                        });
                    }
                }
                
                if (!inImageUpdate) {
                    message.reply(' looks like you are already on twerk.team!\n Please use a valid update command.');
                }
            } else {
                // Add path //
                if (memberAdded) {
                    message.reply(' looks like you are already on twerk.team!\n Please use an update command instead.');
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
                    message.reply('please use this format to submit your channel\n "Channel Name:"\n "Bio:"\n "Stream Link:"\n');
                    return;
                }
                
                if (channelName === '') {
                    message.reply('I couldn\'t find your channel name! Make sure to use "Channel Name:"');
                    return;
                }
                
                if (bio === '') {
                    message.reply('I couldn\'t find your bio! Make sure to use "Bio:"');
                    return;
                }
                
                if (streamUrl === '') {
                    message.reply('I couldn\'t find your stream link! Make sure to use "Stream Link:"');
                    return;
                }
                
                console.log('Channel Name: '+channelName);
                console.log('Bio: '+bio);
                console.log('Stream Url: '+streamUrl);
                
                // Get attachment from message, check for image //
                var imageAttachment = message.attachments;
                imageAttachment.forEach((attachment) => {
                    var attachmentUrl = attachment.url;
                            
                    // Check to see if image, else send error message //
                    if (attachmentUrl.search('.png') !== -1 ||
                    attachmentUrl.search('.jpeg') !== -1 ||
                    attachmentUrl.search('.jpg') !== -1) {
                                    
                        // We have an image attachment //
                        imageProvided = true;
                        
                        // Creator Member Object //
                        let twerkMember = {
                            'discordUsername': message.author.username,
                            'channelName': channelName,
                            'bio': bio,
                            'streamLink': streamUrl,
                            'imageUrl': attachment.url 
                        }
                        
                        // Time to create HTML //
                        generator.createHtml(twerkMember)
                        
                        // Write channleName to text file for later checks //
                        fs.appendFile('./assets/listed-members.txt', message.author.username+'\n', error => {
                            if (error) throw error;
                            console.log('Member has been written to listed-members file');
                        });
                        
                        message.reply('Thanks for your submission!\n Keep Twerkin.');
                        return;
                    } else {
                        console.log('Attachment is not an image.');
                        message.reply('please use .png, .jpeg, .jpg');
                        return;
                    }
                    
                    if (!imageProvided) {
                        console.log('There were no attachments.');
                        message.reply(' looks like you didn\'t attach an image!\n Please submit again.');
                    }
                });
            }
        });
    }
});

//-- MAD PROPS TO KociQQ --//
function cloneString(text) {
    return (' ' + text).slice(1)
}

// Login with token //
client.login(process.env.BOT_TOKEN);