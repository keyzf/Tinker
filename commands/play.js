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

cmd.setExecute(async (client, message, args, cmd) => {
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
    } catch(e) {
        client.logger.error(e, { channel: message.channel, content: message.content });
        return await message.channel.send(await client.operations.get("generateError")(e, `Failed to get information for single video with ID:\`${argsMatch.input}\`\nPlease remember we cannot currently support playlists`));
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
            playing: true
        };

        client.audioQueue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            queueConstruct.connection = await voiceChannel.join();
            client.operations.get("audioPlay")(message.guild.id, queueConstruct.songs[0]);
        } catch (err) {
            console.log(err);
            client.audioQueue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(await client.operations.get("generateDefaultEmbed")({
            title: "Song added to queue",
            description: `${song.title}`,
            author: "Tinker's Tunes",
            authorUrl: "./res/TinkerMusic-purple.png",
            footerText: `Requested by ${message.author.tag}`,
            footerUrl: message.author.displayAvatarURL()
        }));
    }
});

module.exports = cmd;