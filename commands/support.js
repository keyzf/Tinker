'use strict'

const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "support",
    aliases: [],
    category: "Bot",
    description: "Get support for the bot",
    usage: ""
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.bot.support"],
    memberPermissions: ["command.bot.support"]
});

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send(client.operations.generateEmbed.run({
        title: "Support",
        description: `Support is best gained from our [Support Server](https://www.discord.gg/aymBcRP)`,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
});

module.exports = command;