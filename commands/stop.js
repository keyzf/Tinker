'use strict'

const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "stop",
    aliases: [],
    category: "Music",
    description: "Stop the track and clear the queue",
    usage: ""
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.music.stop"],
    memberPermissions: ["command.music.stop"]
});

command.setExecute(async (client, message, args, cmd) => {
    const serverQueue = client.audioQueue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue || !serverQueue.playing) {
        return message.channel.send("There is nothing to stop playing")
    }
    message.channel.send(client.operations.generateEmbed.run({
        title: "Stopped", description: `${serverQueue.songs[0].audioType == "yt" ? serverQueue.songs[0].title : "tts"} stopped and queue cleared`,
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic-purple.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
    serverQueue.songs = [];
    serverQueue.playing = false;
    serverQueue.voiceChannel.leave();
    delete serverQueue.voiceChannel;
});

module.exports = command;