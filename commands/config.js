const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "config",
    aliases: ["setup"],
    category: "Config",
    description: "Setup the bot",
    usage: ""
});

command.setLimits({
    cooldown: 0,
    limited: false
});

command.setPerms({
    userPermissions: ["MANAGE_GUILD"],
    botPermissions: []
});

command.registerSubCommand(`${__dirname}/config/prefix.js`);
command.registerSubCommand(`${__dirname}/config/welcomechannel.js`);
command.registerSubCommand(`${__dirname}/config/logchannel.js`);
command.registerSubCommand(`${__dirname}/config/description.js`);

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send(client.operations.generateEmbed.run({
        title: "Configuration",
        description: `All the things you can setup and configure

        **Coming... at some point:** Tinker Dashboard, a website that you can access anywhere for quick and easy config`,
        fields: [
            {name: "Prefix - \n`prefix`", value: "Change the prefix used to interact with the bot", inline: true},
            {name: "Welcome channel - \n`welcomechannel`", value: "Send a message to a specific channel to welcome new members", inline: true},
            {name: "Logs Channel - \n`logchannel`", value: "Send logging messages to this channel for actions (moderation, message edits, etc)", inline: true},
            {name: "Description - \n`description`", value: "The server description... what is this place about?", inline: true}
        ],
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
});

module.exports = command;