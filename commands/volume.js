const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "volume",
    aliases: [],
    category: "Music",
    description: "Change the volume of the track",
    usage: "<volume (1-100)>"
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
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could set the volume of!');

    let volume;
    try {
        volume = parseInt(args[0]);
        if (volume < 0 || volume > 100) throw new Error()
    } catch (e) {
        return message.channel.send(await client.operations.get("generateDefaultEmbed")({
            title: `Incorrect volume: ${args[0]}`,
            description: "Pick any value between 0 and 100",
            author: "Tinker's Tunes",
            authorUrl: "./res/TinkerMusic-purple.png"
        }));
    }
    serverQueue.volume = volume
    serverQueue.connection.dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
    return message.channel.send(await client.operations.get("generateDefaultEmbed")({
        title: "Volume set",
        description: `${serverQueue.volume}`,
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic-purple.png",
        footerText: `Requested by ${message.author.tag}`,
        footerUrl: message.author.displayAvatarURL()
    }));
});

module.exports = cmd;