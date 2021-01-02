const generateDefaultEmbed = require("../../util/generateDefaultEmbed")

module.exports.run = async(bot, message, args, dbGuild) => {

    const serverQueue = bot.audioQueue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is no queue');
    
    let queue = []
    for (let i=0; i<serverQueue.songs.length; i++) {
        queue.push(`${(i + 1).toString()} ${serverQueue.songs[i].title}`);
    }
    return message.channel.send(generateDefaultEmbed({ title: "Queue", description: queue.reduce((accumulator, current) => { return accumulator + "\n" + current }), author: "Tinker's Tunes", authorUrl: "./res/TinkerMusic.png" }))
}

module.exports.help = {
    name: 'queue',
    aliases: [],
    description: "Get the queue of songs",
    usage: "",
    cooldown: 1,
    inDev: false,
    generated: true

};