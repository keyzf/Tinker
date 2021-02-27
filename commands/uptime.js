const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "uptime",
    aliases: ["ut"],
    category: "Bot",
    description: "Get information about how long the bot has been online for",
    usage: ""
});

cmd.setLimits({
    cooldown: 1,
    limited: false
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

const ms = require("pretty-ms")

cmd.setExecute(async(client, message, args, cmd) => {
    try {
        const { totalUptime } = client.data.db.prepare(`SELECT totalUptime FROM bot`).get();
        await message.channel.send(client.operations.generateEmbed.run({
            description: `Since last restart: ${ms(client.uptime)}\nFrom the beginning of its very existence: ${ms(totalUptime+client.uptime)}`,
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
        }));
    } catch (e) {
        client.logger.error(e.stack, { channel: message.channel });
        return await message.channel.send(await client.operations.generateError.run(e, "Error getting bot uptime"));
    }
});

module.exports = cmd;