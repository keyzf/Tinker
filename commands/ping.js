'use strict'

const Command = require("../structures/Command");

const command = new Command();

command.setInfo({
    name: "ping",
    aliases: ["pong"],
    category: "Bot",
    description: "Shows the bots ping",
    usage: ""
});
command.setLimits({
    cooldown: 5
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.bot.ping"],
    memberPermissions: ["command.bot.ping"]
});

command.setExecute(async(client, message, args) => {
    try {
        message.channel.send("Ping?").then((m) => {
            m.edit("", client.operations.generateEmbed.run({
                title: "Pong!",
                description: `Interaction latency of \`${m.createdTimestamp - message.createdTimestamp}ms\`\nAPI Latency of \`${Math.round(client.ws.ping)}ms\``,
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
            }));
        });
    } catch ({stack}) {
        client.logger.error(stack, { channel: message.channel, content: message.content, origin: __filename });
        return await message.channel.send(await client.operations.generateError.run(stack, "Error getting bot latency info", { channel: message.channel, content: message.content, origin: __filename }));
    }
});

module.exports = command;
