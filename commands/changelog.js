const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "changelog",
    aliases: [],
    category: "Bot",
    description: "View recent changes to the bot",
    usage: ""
});

command.setLimits({
    cooldown: 5,
    limited: true
});

command.setPerms({
    botPermissions: [],
    userPermissions: []
});

command.setExecute(async(client, message, args, cmd) => {
    message.channel.send("Not yet...")
});

module.exports = command;