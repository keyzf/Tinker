const ms = require("pretty-ms");
const { MessageEmbed } = require("discord.js");
const { db, Fields } = require("../../lib/db");

module.exports.run = (bot, message, args) => {
    const { totalUptime } = db.prepare(`SELECT totalUptime FROM bot`).get();
    const embed = new MessageEmbed()
        .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL())
        .setDescription(`Since last restart: ${ms(bot.uptime)}\nFrom the beginning of its very existance: ${ms(totalUptime+bot.uptime)}`)
        .setAuthor(bot.user.tag)
        .setThumbnail(bot.user.displayAvatarURL());
    message.channel.send(embed);
}

module.exports.help = {
    name: "uptime",
    aliases: ["awake"],
    description: "Returns the amount of time the bot has been active for",
    cooldown: 2,
    generated: true
}