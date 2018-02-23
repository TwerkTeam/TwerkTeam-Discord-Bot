//-- Help Commands --//

// Logic/props goes here //
const helpMessageP1 = 
` welcome to the official partner program! I'm here to showcase your accomplishment on our website.
Here is the perfect command to get started:
\`\`\`Channel Name: MyChannelName\nBio: MyBio\nStream Link: http://www.MyStreamLink.com\n*Attach Image*\`\`\``;

const helpMessageP2 = 
` already a part of the TwerkTeam site? Let me help you update your content by using one of these commands:\n
\`!updateChannel MyUpdatedChannel\` ---> Update your channel name.
\`!updateBio MyUpdatedBio\` ---> Update your bio.
\`!updateStreamLink MyUpdatedStreamLink\` ---> Update your stream url.
\`!updateImage *Attach Image*\` ---> Update your image.
\`!help\` ---> Get list of commands.`

module.exports.run = async(bot, message) => {
    console.log('Replying with help command...');
    await message.reply(helpMessageP1);
    await message.reply(helpMessageP2);
}

module.exports.help = {
    name: 'help'
}