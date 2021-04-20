const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "queue",
    aliases: [],
    category: "Music",
    description: "View the music queue for this guild",
    usage: ""
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.music.queue"],
    memberPermissions: ["command.music.queue"]
});

command.setExecute(async(client, message, args, cmd) => {
    const serverQueue = client.audioQueue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is no queue');

    let queue = []
    for (let i = 0; i < serverQueue.songs.length; i++) {
        queue.push(`${(i + 1).toString()} ${serverQueue.songs[i].title}`);
    }
    return message.channel.send(client.operations.generateEmbed.run({
        title: "Queue",
        description: queue.reduce((accumulator, current) => {
            return accumulator + "\n" + current
        }),
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic-purple.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }))
});

module.exports = command;