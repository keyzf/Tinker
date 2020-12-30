module.exports.run = async(bot, message, args, dbGuild) => {
    const serverQueue = bot.audioQueue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) { return message.channel.send("There is nothing to stop playing")}
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

module.exports.help = {
    name: 'stop',
    aliases: [],
    description: "clear queue and stop all music",
    usage: "",
    cooldown: 2,
    inDev: false,
    generated: true

};