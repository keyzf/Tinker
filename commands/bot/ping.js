const generateDefaultEmbed = require("../../util/generateDefaultEmbed");

module.exports.run = async (bot, message, args) => {
    message.channel.send("Ping?").then((m) => {
        m.edit("", generateDefaultEmbed({
            title: "Pong!",
            description: `Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ws.ping)}ms`
        }));
    });
}

module.exports.help = {
    name: "ping",
    aliases: ["pong"],
    description: "Returns the latency of the bot and the api",
    usage: "",
    cooldown: 5,
    generated: true
}
