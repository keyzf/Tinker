'use strict'

const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "premium",
    aliases: [],
    category: "Bot",
    description: "Get premium for some cool rewards",
    usage: ""
});

command.setLimits({
    cooldown: 0
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.bot.premium"],
    memberPermissions: ["command.bot.premium"]
});

command.setExecute(async(client, message, args, cmd) => {
    return message.channel.send(client.operations.generateEmbed.run({
        title: "Premium",
        description: `Premium can provide you with benefits in the future... But for right now it is unavailable to purchase.\nI know its sad but don't fret, it will arrive at some point!`,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by ", message.author, "")
    }));
});

module.exports = command;