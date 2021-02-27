const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "stop",
    aliases: [],
    category: "Music",
    description: "Stop the track and clear the queue",
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
    if (!serverQueue) { return message.channel.send("There is nothing to stop playing")}
    message.channel.send(client.operations.generateEmbed.run(
        { title: "Stopped", description: `${serverQueue.songs[0].title} stopped and queue cleared`,
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic-purple.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
});

module.exports = cmd;