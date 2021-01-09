const generateDefaultEmbed = require("../../util/generateDefaultEmbed")
const ms = require("pretty-ms");

module.exports.run = async(bot, message, args, dbGuild) => {

    const serverQueue = bot.audioQueue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is nothing playing.');
    return message.channel.send(generateDefaultEmbed({
        title: "Now Playing",
        description: `[${serverQueue.songs[0].title}: ${serverQueue.songs[0].author} (${ms(parseInt(serverQueue.songs[0].lengthSeconds) * 1000)})](${serverQueue.songs[0].url})`,
        imageUrl: serverQueue.songs[0].thumbnail.url,
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic.png",
        footerText: `Song requested by ${serverQueue.songs[0].requestedBy.usertag}`,
        footerUrl: serverQueue.songs[0].requestedBy.avatar
    }))
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