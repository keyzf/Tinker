module.exports.run = async(bot, message, args, dbGuild) => {

    const serverQueue = bot.audioQueue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is nothing playing.');
    return message.channel.send(`Now playing: ${serverQueue.songs[0].title}`);
}

module.exports.help = {
    name: 'nowplaying',
    aliases: [],
    description: "Get the currently playing song info",
    usage: "",
    cooldown: 1,
    inDev: true
};