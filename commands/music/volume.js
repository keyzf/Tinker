module.exports.run = async(bot, message, args, dbGuild) => {
    const serverQueue = bot.audioQueue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could set the volume of!');
    // TODO: parse the user input to be a volume percentage between 0 (silent) and 1
    serverQueue.connection.dispatcher.volume();
}
module.exports.help = {
    name: 'volume',
    aliases: [],
    description: "change the volume of the song",
    usage: "",
    cooldown: 1,
    inDev: true,
    generated: true
};