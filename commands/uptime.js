const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "uptime",
    aliases: ["ut"],
    category: "Bot",
    description: "Get information about how long the bot has been online for",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.bot.uptime"],
    memberPermissions: ["command.bot.uptime"]
});

const ms = require("pretty-ms")

command.setExecute(async(client, message, args, cmd) => {
    try {
        const [{ totalUptime }] = await client.data.db.query(`select totalUptime from bot where env='${process.env.NODE_ENV}'`);
        await message.channel.send(client.operations.generateEmbed.run({
            description: `Since last restart: ${ms(client.uptime)}\nFrom the very beginning of its existence: ${ms(new Date(totalUptime + client.uptime).getTime())}`,
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
        }));
    } catch (e) {
        client.logger.error(e.stack, { channel: message.channel });
        return await message.channel.send(await client.operations.generateError.run(e, "Error getting bot uptime"));
    }
});

module.exports = command;