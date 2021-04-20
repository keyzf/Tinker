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
    cooldown: 2
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.music.volume"],
    memberPermissions: ["command.music.volume"]
});

cmd.setExecute(async(client, message, args, cmd) => {
    const serverQueue = client.audioQueue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could set the volume of!');

    if (!args.length) {
        return message.channel.send(client.operations.generateEmbed.run({
            title: "Volume",
            description: `${serverQueue.volume}`,
            author: "Tinker's Tunes",
            authorUrl: "./res/TinkerMusic-purple.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
        }));
    }

    let volume = parseInt(args[0]);
    if (isNaN(volume) || parseInt(volume) < 0 || parseInt(volume) > 100) {
        return message.channel.send(client.operations.generateEmbed.run({
            title: `Incorrect volume: ${args[0]}`,
            description: "Pick any value between 0 and 100",
            author: "Tinker's Tunes",
            authorUrl: "./res/TinkerMusic-purple.png"
        }));
    }

    serverQueue.volume = volume;
    serverQueue.connection.dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
    return message.channel.send(client.operations.generateEmbed.run({
        title: "Volume set",
        description: `${serverQueue.volume}`,
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic-purple.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
});

module.exports = cmd;