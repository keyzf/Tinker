module.exports.run = async(bot, message, args, dbGuild) => {
    const serverQueue = bot.audioQueue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.connection.dispatcher.end();
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