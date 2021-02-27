const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "pause",
    aliases: [],
    category: "Music",
    description: "Pause the currently playing music",
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
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could pause!');
    serverQueue.connection.dispatcher.pause(true);
    return message.channel.send(client.operations.generateEmbed.run(
        { title: "Song Paused",
        description: serverQueue.songs[0].title,
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic-purple.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
});

module.exports = cmd;