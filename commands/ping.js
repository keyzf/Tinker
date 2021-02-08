const Command = require("../structures/Command");

const cmd = new Command();

cmd.setInfo({
    name: "ping",
    aliases: ["pong"],
    category: "Bot",
    description: "Shows the bots ping",
    usage: ""
});
cmd.setLimits({
    cooldown: 5
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

cmd.setExecute(async(client, message, args) => {
    try {
        message.channel.send("Ping?").then((m) => {
            m.edit("", client.operations.get("generateDefaultEmbed")({
                title: "Pong!",
                description: `Interaction latency of \`${m.createdTimestamp - message.createdTimestamp}ms\`\nAPI Latency of \`${Math.round(client.ws.ping)}ms\``
            }));
        });
    } catch (e) {
        client.logger.error(e.stack, { channel: message.channel, content: message.content });
        return await message.channel.send(await client.operations.get("generateError")(e, "Error getting bot latency info"));
    }
});

module.exports = cmd;
