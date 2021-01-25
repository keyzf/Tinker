const ms = require("pretty-ms");
const { db, Fields } = require("../../lib/db");
const logger = require("../../lib/logger");
const generateDefaultEmbed = require("../../util/generateDefaultEmbed");

module.exports.run = async (bot, message, args) => {
    try {
        const { totalUptime } = db.prepare(`SELECT totalUptime FROM bot`).get();
        message.channel.send(generateDefaultEmbed({
            description: `Since last restart: ${ms(bot.uptime)}\nFrom the beginning of its very existence: ${ms(totalUptime+bot.uptime)}`
        }));
    } catch (e) {
        logger.error(e.stack, { channel: message.channel });
        return await message.channel.send(await bot.cevents.get("generateError").run(e, "Error getting bot uptime"));
    }
}

module.exports.help = {
    name: "uptime",
    aliases: ["awake"],
    description: "Returns the amount of time the bot has been active for",
    cooldown: 2,
    generated: true
}