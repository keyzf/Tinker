'use strict'

const Command = require(`../../structures/Command`);
const cmd = new Command();

cmd.setInfo({
    name: "bongocat",
    aliases: [],
    category: "Fun",
    description: "Show bongocat",
    usage: ""
});

cmd.setLimits({
    cooldown: 5
});

cmd.setPerms({
    botPermissions: ["EMBED_LINKS"],
    userPermissions: ["USE_EXTERNAL_EMOJIS"],
    globalUserPermissions: ["user.command.emoji.bongocat"],
    memberPermissions: ["command.emoji.bongocat"]
});

cmd.setExecute(async (client, message, args, cmd) => {
    message.channel.send("https://cdn.discordapp.com/emojis/794633637756796948.gif?v=1")
});

module.exports = cmd;