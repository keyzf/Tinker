const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "play",
    aliases: [],
    category: "Music",
    description: "play music from YouTube link",
    usage: "<link>"
});

cmd.setLimits({
    cooldown: 2,
    limited: false
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

const ytdl = require("ytdl-core");

cmd.setExecute(async(client, message, args, cmd) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Gotta be in a vc");
    if (!args[0]) return client.commands.get("resume").run(message, args, cmd)

    let argsMatch = args[0].match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/);
    if (!argsMatch) {
        message.channel.send("Invalid YouTube URL, searching YouTube instead").then((m) => m.delete({ timeout: 5000 }))
        return client.commands.get("search").run(message, args, cmd)
    }

    let songInfo;
    try {
        songInfo = await ytdl.getInfo(argsMatch.input);
    } catch ({ stack }) {
        client.logger.error(stack, { channel: message.channel, content: message.content, origin: __filename });
        return await message.channel.send(await client.operations.generateError.run(stack, `Failed to get information for single video with ID:\`${argsMatch.input}\`\nPlease remember we cannot currently support playlists`, { channel: message.channel, content: message.content, origin: __filename }));
    }
    const song = {
        title: songInfo.videoDetails.title,
        author: songInfo.videoDetails.author.name,
        url: songInfo.videoDetails.video_url,
        lengthSeconds: songInfo.videoDetails.lengthSeconds,
        thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1],
        requestedBy: {
            usertag: message.author.tag,
            avatar: message.author.displayAvatarURL()
        }
    };

    const serverQueue = client.audioQueue.get(message.guild.id);

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 50,
            playing: true,
            timeoutUid: null
        };

        client.audioQueue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            queueConstruct.connection = await voiceChannel.join();
        } catch ({ stack }) {
            client.logger.error(stack);
            client.audioQueue.delete(message.guild.id);
            return message.channel.send(await client.operations.generateError.run(stack));
        }

        client.operations.audioPlay.run(message.guild.id, queueConstruct.songs[0]);

    } else {
        serverQueue.songs.push(song);

        if (serverQueue.playing) {
            return message.channel.send(await client.operations.generateEmbed.run({
                title: "Song added to queue",
                description: `${song.title}`,
                author: "Tinker's Tunes",
                authorUrl: "./res/TinkerMusic-purple.png",
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
            }));
        } else {
            client.operations.audioPlay.run(message.guild.id, serverQueue.songs[0]);
        }
    }
});

module.exports = cmd;