const Discord = require('discord.js');
const fs = require('fs');

// Code written by: (https://github.com/bolacha) ---> MAD PROPS
module.exports.setCommands = (client, folderOnRoot = 'commands') => {

    // Creating an commands Collection from the Discord Collection
    // Here is the URL : https://discord.js.org/#/docs/main/stable/class/Collection
    client.commands = new Discord.Collection();

    // Get the folder in the right root path
    folderOnRoot = `${__dirname}/../${folderOnRoot}/`;

    // Read for all the commands inside the folder
    fs.readdir(folderOnRoot, (err, files) => {
        if (err) console.log(err);

        // Remove all the files that are not .js
        let commands = files.filter(file => file.split('.').pop() === 'js');

        if (commands.length <= 0) {
            console.log('No commands found to be loaded !');
            return;
        }

        console.log(`Loading ${commands.length} commands.`);

        // Loop thorught the commands array and adding to the commands collection
        commands.forEach((f , i ) => {
            let props = require(`${folderOnRoot}${f}`);

            console.log(`${ i + 1 } : ${f} loaded.`);

            client.commands.set(props.help.name, props);
        });
    });
}