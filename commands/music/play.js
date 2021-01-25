const setResponses = require("../../data/setResponse");
const ytdl = require('ytdl-core');
const logger = require("../../lib/logger");
const generateDefaultEmbed = require("../../util/generateDefaultEmbed")

module.exports.run = async(bot, message, args, dbGuild) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send(setResponses.mustBeInVoiceChannel());
    if (!args[0]) return bot.commands.get("resume").run(bot, message, args, dbGuild)

    let argsMatch = args[0].match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/);
    if (!argsMatch) {
        message.channel.send("Invalid YouTube URL, searching YouTube instead").then((m) => m.delete({ timeout: 5000 }))
        return bot.commands.get("search").run(bot, message, args, dbGuild)
    }

    let songInfo;
    try {
        songInfo = await ytdl.getInfo(argsMatch.input);
    } catch(e) {
        logger.error(e, { channel: message.channel, content: message.content });
        return await message.channel.send(await bot.cevents.get("generateError").run(e, `Failed to get information for single video with ID:\`${argsMatch.input}\`\nPlease remember we cannot currently support playlists`));
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

    const serverQueue = bot.audioQueue.get(message.guild.id);

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 50,
            playing: true
        };

        bot.audioQueue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            bot.cevents.get("audioPlay").run(bot.audioQueue, message.guild.id, queueConstruct.songs[0]);
        } catch (err) {
            console.log(err);
            bot.audioQueue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(generateDefaultEmbed({ title: "Song added to queue", description: `${song.title}`, author: "Tinker's Tunes", authorUrl: "./res/TinkerMusic.png", footerText: `Requested by ${message.author.tag}`, footerUrl: message.author.displayAvatarURL() }))
    }
}
module.exports.help = {
    name: 'play',
    aliases: [],
    description: "plays music from YouTube given a link",
    usage: "\"[Full Link]\"",
    cooldown: 2,
    inDev: false,
    generated: true

};