const generateDefaultEmbed = require("../../util/generateDefaultEmbed")

module.exports.run = async(bot, message, args, dbGuild) => {
    const serverQueue = bot.audioQueue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could set the volume of!');
    
    let volume;
    try {
        volume = parseInt(args[0]);
        if (volume < 0 || volume > 100) throw new Error()
    } catch (e) {
        return message.channel.send(generateDefaultEmbed({ title: `Incorrect volume: ${args[0]}`, description: "Pick any value between 0 and 100", author: "Tinker's Tunes", authorUrl: "./res/TinkerMusic.png" }))
    }
    serverQueue.volume = volume
    serverQueue.connection.dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
    return message.channel.send(generateDefaultEmbed({ title: "Volume set", description: `${serverQueue.volume}`, author: "Tinker's Tunes", authorUrl: "./res/TinkerMusic.png", footerText: `Requested by ${message.author.tag}`, footerUrl: message.author.displayAvatarURL()  }))
}
module.exports.help = {
    name: 'volume',
    aliases: [],
    description: "change the volume of the song",
    usage: "",
    cooldown: 1,
    inDev: false,
    generated: true
};