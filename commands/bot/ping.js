const { MessageEmbed } = require("discord.js");

module.exports.run = async (bot, message, args) => {

    const m = await message.channel.send("Ping?");

    const embed = new MessageEmbed()
        .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL())
        .setTitle("Pong!")
        .setDescription(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ws.ping)}ms`)
    m.delete({timeout: 1})
    message.channel.send(embed);
}

module.exports.help = {
    name: "ping",
    aliases: ["pong"],
    description: "Returns the latency of the bot and the api",
    usage: "",
    cooldown: 5
}
