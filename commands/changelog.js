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
    cooldown: 5
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["indev.command.bot.changelog"],
    memberPermissions: ["command.bot.changelog"]
});

command.setExecute(async(client, message, args, cmd) => {
    message.channel.send("Not yet...")
});

module.exports = command;