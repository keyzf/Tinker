const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "disconnect",
    aliases: ["dc"],
    category: "Music",
    description: "Force disconnect from VC",
    usage: ""
});

command.setLimits({
    cooldown: 0
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.music.disconnect"],
    memberPermissions: ["command.music.disconnect"]
});

command.setExecute(async (client, message, args, cmd) => {
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    const serverQueue = client.audioQueue.get(message.guild.id);
    if (!serverQueue || !serverQueue.voiceChannel) {
        return message.channel.send(client.operations.generateEmbed.run({
            title: "No VC to disconnect from",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
        }));
    }
    message.channel.send(client.operations.generateEmbed.run({
        title: "Disconnected",
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