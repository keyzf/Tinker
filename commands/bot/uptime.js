const ms = require("pretty-ms");
const { MessageEmbed } = require("discord.js");
const { db, Fields } = require("../../lib/db");
const generateDefaultEmbed = require("../../util/generateDefaultEmbed");

module.exports.run = (bot, message, args) => {
    const { totalUptime } = db.prepare(`SELECT totalUptime FROM bot`).get();
    message.channel.send(generateDefaultEmbed({
        description: `Since last restart: ${ms(bot.uptime)}\nFrom the beginning of its very existence: ${ms(totalUptime+bot.uptime)}`
    }));
}

module.exports.help = {
    name: "uptime",
    aliases: ["awake"],
    description: "Returns the amount of time the bot has been active for",
    cooldown: 2,
    generated: true
}