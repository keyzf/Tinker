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

cmd.setExecute(async (client, message, args, cmd) => {
    const serverQueue = client.audioQueue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could pause!');
    serverQueue.connection.dispatcher.pause(true);
    const timer = client.timeoutManager.createTimer(2 * 60 * 1000); // timeout after 2 minutes
    serverQueue.timeoutUid = timer.uid;
    timer.on("fire", () => {
        if (serverQueue && serverQueue.voiceChannel) {
            serverQueue.textChannel.send(client.operations.generateEmbed.run({
                title: "Goodbye!",
                description: "You left me on pause :( ",
                author: "Tinker's Tunes",
                authorUrl: "./res/TinkerMusic-purple.png",
                colour: client.statics.colours.tinker
            }));
            serverQueue.voiceChannel.leave();
        }
    });
    return message.channel.send(client.operations.generateEmbed.run({
        title: "Song Paused",
        description: serverQueue.songs[0].title,
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic-purple.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
});

module.exports = cmd;