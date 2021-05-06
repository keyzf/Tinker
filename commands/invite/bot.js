'use strict'

const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "bot",
    aliases: ["tinker"],
    category: "Bot",
    description: "Get a link to add Tinker to your own server",
    usage: ""
});

command.setLimits({
    cooldown: 3
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.bot.invite.bot"],
    memberPermissions: ["command.bot.invite.bot"]
});

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send(client.config.config.invite)
});

module.exports = command;
