//-- PROPS TO binaryslothtree --//
const cheerio = require('cheerio');
const Client = require('ssh2-sftp-client');
const sftp = new Client();
const fs = require('fs');

// Connect to web server //
sftp.connect({
    host: process.env.FTP_HOST,
    port: 22,
    username: process.env.FTP_USER,
    password: process.env.FTP_PW 
}).catch((err) => {
    console.log(err, 'catch error');
});

module.exports = {
    // Get current streamergallery from web server //
    getCurrentGallery: function(callback) {
        console.log('Getting current streamergallery file...');
        
        sftp.get(process.env.FTP_FILEPATH_GALLERY).then((stream) => {
            // Create write stream //
            var writeStream = fs.createWriteStream('./assets/streamergallery.html');
            
            // Pipe readable stream into current file //
            stream.pipe(writeStream);
            
            // On pipe end, send call back //
            stream.on('end', function() {
                console.log('Current streamergallery written to local memory.');
                callback(true);
            });
        }).catch((error) => {
            console.log(error);
            callback(false);
        });
    },
    
    getCurrentMembers: function(callback) {
        console.log('Getting current members list...');
        
        sftp.get(process.env.FTP_FILEPATH_MEMBERS).then((stream) => {
            // Create write stream //
            var writeStream = fs.createWriteStream('./assets/listed-members.txt');
            
            // Pipe readable stream into current file //
            stream.pipe(writeStream);
            
            // On pipe end, send call back //
            stream.on('end', function() {
                console.log('Current members list written to local memory.');
                callback(true);
            });
        }).catch((error) => {
            console.log(error);
            callback(false);
        });
    },
    
    // Takes a member Object //
    createHtml: function(twerkMember) {
        /*
        <div class="col-lg-3 col-md-6">
            <div id="// DISCORD USERNAME //"class="nk-gallery-item-box">
                // STREAMER IMAGE //
                <a href="" class="nk-gallery-item" data-size="510x500">
                    <div class="nk-gallery-item-overlay">
                        <span class="ion-eye"></span>
                    </div>
                    // STREAMER IMAGE //
                    <img src="" alt="">
                </a>
                <div class="nk-gallery-item-description">
                    <h4>// STREAMER CHANNEL //</h4>
                    <p>
                        // STREAMER BIO // <a target="_blank" href="// STREAMER LINK //">// STREAMER CHANNEL NAME //</a>
                    </p>
                </div>
            </div>
        </div>
        */
        
        // Get current gallery from web server //
        this.getCurrentGallery((didFinish) => {
            if (didFinish) {
                // Setup cheerio //
                fs.readFile('./assets/streamergallery.html', 'utf8' , (err, data) => {
                    if (err) throw err;
                    // Load in HTML file //
                    let $ = cheerio.load(data);
                    
                    // Build HTML string here //
                    let html =
                    '<div class="col-lg-3 col-md-6">\n'+
                        // DISCORD USERNAME //
                        '<div id="'+twerkMember.discordUsername+'" class="nk-gallery-item-box">\n'+
                            // STREAMER IMAGE //
                            '<a href='+twerkMember.imageUrl+' class="nk-gallery-item twerker-image" data-size="510x500">\n'+
                                '<div class="nk-gallery-item-overlay">\n'+
                                    '<span class="ion-eye"></span>\n'+
                                '</div>\n'+
                                // STREAMER IMAGE //
                                '<img class="twerker-image" src='+twerkMember.imageUrl+' alt="">\n'+
                            '</a>\n'+
                            '<div class="nk-gallery-item-description">\n'+
                                // STREAMER CHANNEL //
                                '<h4 class="twerker-channel-name">'+twerkMember.channelName+'</h4>\n'+
                                // STREAMER BIO //
                                '<p class="twerker-bio">\n'+
                                    // STREAMER LINK //
                                    twerkMember.bio+' | <a target="_blank" class="twerker-stream-link" href='+twerkMember.streamLink+'>'+'Check out '+twerkMember.channelName+'</a> |\n'+
                                '</p>\n'+
                            '</div>\n'+
                        '</div>\n'+
                    '</div>\n';
                    
                    // Get gallery elements //
                    $('#streamer_injector').append(html);

                    console.log('Updated streamer_injector div with new member.');

                    // Write back to html file //
                    fs.writeFile('./assets/streamergallery.html', $.html(), error => {
                        if (error) throw error;
                        console.log('Streamer gallery file updated.');
                        
                        // Write to web server //
                        sftp.put('./assets/streamergallery.html', process.env.FTP_FILEPATH_GALLERY);
                        sftp.put('./assets/listed-members.txt', process.env.FTP_FILEPATH_MEMBERS);
                    });
                });      
            }
        });
    },
    
    updateMember: function(updateData) {
        // Get current gallery from web server //
        this.getCurrentGallery((didFinish) => {
            // Setup cheerio //
            fs.readFile('./assets/streamergallery.html', 'utf8' , (err, data) => {
                if (err) throw err;
                
                /*
                    {
                        discordUsername: String,
                        command: String,
                        content: String
                    }
                */
                // Load in HTML file //
                var $ = cheerio.load(data);
                
                // Figure out what needs to be update //
                if (updateData.command === 'channelName') {
                    // Find html with discordUsername as id //
                    var twerker = $('#'+updateData.discordUsername);
                    var newChannelName = updateData.content;
                    
                    // h4 tag //
                    $('.twerker-channel-name', twerker).text(newChannelName);
                    
                    // Streamer link tag //
                    $('.twerker-stream-link', twerker).text('Check out '+newChannelName);
                    
                    console.log('Updated '+updateData.discordUsername+' div with new channel name.');
                    
                    // Write back to html file //
                    fs.writeFile('./assets/streamergallery.html', $.html(), error => {
                        if (error) throw error;
                        console.log('Streamer gallery file updated.');
                        
                        // Write to web server //
                        sftp.put('./assets/streamergallery.html', process.env.FTP_FILEPATH_GALLERY);
                    });
                }
                
                if (updateData.command === 'bio') {
                    // Find html with discordUsername as id //
                    var twerker = $('#'+updateData.discordUsername);
                    var currentBio = $('.twerker-bio', twerker);
                    var currentStreamLink = $('.twerker-stream-link', currentBio);
                    var currentStreamUrl = currentStreamLink.attr('href');
                    var currentChannelName = currentStreamLink.text();
                    
                    console.log('Current Stream Link: '+currentStreamUrl);
                    console.log('Current Stream Channel Name: '+currentChannelName);
                    
                    // Get content of bio to retrieve current stream link //
                    
                    currentBio.replaceWith(
                        '<p class="twerker-bio">'+
                            updateData.content+' | <a target="_blank" class="twerker-stream-link" href='+currentStreamUrl+'>'+currentChannelName+'</a> |'+
                        '</p>'
                    );
                    
                    console.log('Updated '+updateData.discordUsername+' div with new Bio.');
                    
                    // Write back to html file //
                    fs.writeFile('./assets/streamergallery.html', $.html(), error => {
                        if (error) throw error;
                        console.log('Streamer gallery file updated.');
                        
                        // Write to web server //
                        sftp.put('./assets/streamergallery.html', process.env.FTP_FILEPATH_GALLERY);
                    });
                }
                
                if (updateData.command === 'streamLink') {
                    // Find html with discordUsername as id //
                    var twerker = $('#'+updateData.discordUsername);
                    var twerkerBio = $('.twerker-bio', twerker);
                    $('.twerker-stream-link', twerkerBio).attr('href', updateData.content);
                    
                    console.log('Updated '+updateData.discordUsername+' div with new stream link.');
                    
                    // Write back to html file //
                    fs.writeFile('./assets/streamergallery.html', $.html(), error => {
                        if (error) throw error;
                        console.log('Streamer gallery file updated.');
                        
                        // Write to web server //
                        sftp.put('./assets/streamergallery.html', process.env.FTP_FILEPATH_GALLERY);
                    });
                }
                
                if (updateData.command === 'image') {
                    // Find html with discordUsername as id //
                    var twerker = $('#'+updateData.discordUsername);
                    $('a.twerker-image', twerker).attr('href', updateData.content);
                    $('img.twerker-image', twerker).attr('src', updateData.content);
                    
                    console.log('Updated '+updateData.discordUsername+' div with new image url.');
                    
                    // Write back to html file //
                    fs.writeFile('./assets/streamergallery.html', $.html(), error => {
                        if (error) throw error;
                        console.log('Streamer gallery file updated.');
                        
                        // Write to web server //
                        sftp.put('./assets/streamergallery.html', process.env.FTP_FILEPATH_GALLERY);
                    });
                }
            });
        });
    }
}