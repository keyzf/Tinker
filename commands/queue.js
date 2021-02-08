const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "queue",
    aliases: [],
    category: "Music",
    description: "View the music queue for this guild",
    usage: ""
});

cmd.setLimits({
    cooldown: 2,
    limited: false
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

cmd.setExecute(async(client, message, args, cmd) => {
    const serverQueue = client.audioQueue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is no queue');

    let queue = []
    for (let i = 0; i < serverQueue.songs.length; i++) {
        queue.push(`${(i + 1).toString()} ${serverQueue.songs[i].title}`);
    }
    return message.channel.send(await client.operations.get("generateDefaultEmbed")({
        title: "Queue",
        description: queue.reduce((accumulator, current) => {
            return accumulator + "\n" + current
        }),
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic-purple.png", 
        footerText: `Requested by ${message.author.tag}`,
        footerUrl: message.author.displayAvatarURL()
    }))
});

module.exports = cmd;