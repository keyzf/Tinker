module.exports.run = async(bot, message, args, dbGuild) => {

    const serverQueue = bot.audioQueue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is no queue');
    
    let output = "**Queue**\n"
    for (let i=0; i<serverQueue.songs.length; i++) {
        output += "**" + (i + 1).toString() + "** " + serverQueue.songs[i].title + "\n"
    }
    return message.channel.send(output);
}

module.exports.help = {
    name: 'queue',
    aliases: [],
    description: "Get the queue of songs",
    usage: "",
    cooldown: 1,
    inDev: true
};