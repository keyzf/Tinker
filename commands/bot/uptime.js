const ms = require("pretty-ms");
const { MessageEmbed } = require("discord.js");

module.exports.run = (bot, message, args) => {

    const embed = new MessageEmbed()
    .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL())
    .setDescription(ms(bot.uptime))
    .setAuthor(bot.user.tag)
    .setThumbnail(bot.user.displayAvatarURL());
    message.channel.send(embed);
}

module.exports.help = {
    name: "uptime",
    aliases: ["awake"],
    description: "Returns the amount of time the bot has been active for",
    cooldown: 10
}