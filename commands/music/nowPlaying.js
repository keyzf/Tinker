const generateDefaultEmbed = require("../../util/generateDefaultEmbed")

module.exports.run = async(bot, message, args, dbGuild) => {

    const serverQueue = bot.audioQueue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is nothing playing.');
    return message.channel.send(generateDefaultEmbed({ title: "Now Playing", description: serverQueue.songs[0].title, author: "Tinker's Tunes", authorUrl: "./res/TinkerMusic.png" }))
}

module.exports.help = {
    name: 'nowplaying',
    aliases: ["songinfo", "playingnow"],
    description: "Get the currently playing song info",
    usage: "",
    cooldown: 1,
    inDev: false,
    generated: true
};