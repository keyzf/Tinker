const generateDefaultEmbed = require("../../util/generateDefaultEmbed")

module.exports.run = async(bot, message, args, dbGuild) => {
    const serverQueue = bot.audioQueue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could pause!');
    serverQueue.connection.dispatcher.pause();
    return message.channel.send(generateDefaultEmbed({ title: "Song Paused", description: serverQueue.songs[0].title, author: "Tinker's Tunes", authorUrl: "./res/TinkerMusic.png" }))
}
module.exports.help = {
    name: 'pause',
    aliases: [],
    description: "pause this song",
    usage: "",
    cooldown: 2,
    inDev: false,
    generated: true
};