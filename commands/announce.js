const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "announce",
    aliases: [],
    category: "Moderation",
    description: "Send an announcement embed",
    usage: "\"<title>\" \"<message>\" [release time]"
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: ["MANAGE_MESSAGES", "MANAGE_WEBHOOKS"],
    botPermissions: ["MANAGE_MESSAGES", "MANAGE_WEBHOOKS"],
    globalUserPermissions: ["indev.command.moderation.announce"],
    memberPermissions: ["command.moderation.announce"]
});

const ts = require('timestring');
const { v4: uuidv4 } = require("uuid");

command.setExecute(async(client, message, args, cmd) => {
    return;
});

module.exports = command;