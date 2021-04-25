const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "resume",
    aliases: [],
    category: "Music",
    description: "Resume the current track",
    usage: ""
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.music.resume"],
    memberPermissions: ["command.music.resume"]
});

command.setExecute(async(client, message, args, cmd) => {
    const serverQueue = client.audioQueue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue || !serverQueue.playing) return message.channel.send('There is no song that I could resume!');
    await serverQueue.connection.dispatcher.resume();
    serverQueue.playing = true;
    return message.channel.send(client.operations.generateEmbed.run({
        title: "Song Resumed",
        description: serverQueue.songs[0].title,
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic-purple.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
});

module.exports = command;