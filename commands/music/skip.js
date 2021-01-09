const generateDefaultEmbed = require("../../util/generateDefaultEmbed")

module.exports.run = async(bot, message, args, dbGuild) => {
    const serverQueue = bot.audioQueue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.connection.dispatcher.end();
    return message.channel.send(generateDefaultEmbed({ title: "Song Skipped", author: "Tinker's Tunes", authorUrl: "./res/TinkerMusic.png", footerText: `Requested by ${message.author.tag}`, footerUrl: message.author.displayAvatarURL()  }))

}
module.exports.help = {
    name: 'skip',
    aliases: ["next"],
    description: "skip this song and play the next",
    usage: "",
    cooldown: 2,
    inDev: false,
    generated: true
};