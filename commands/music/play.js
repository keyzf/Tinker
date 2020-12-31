const setResponses = require("../../data/setResponse");
const ytdl = require('ytdl-core');
// const logger = require("../../lib/logger");
const { play } = require("../../util/audioPlay");

module.exports.run = async(bot, message, args, dbGuild) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send(setResponses.mustBeInVoiceChannel());
    if (!args[0]) return message.channel.send(`${dbGuild.prefix}${this.help.name} ${this.help.usage}`)

    let argsMatch = args[0].match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/);
    if (!argsMatch) {
        message.channel.send("Invalid YouTube URL, searching YouTube instead").then((m) => m.delete({timeout:5000}))
        return bot.commands.get("search").run(bot, message, args, dbGuild)
    }

    const songInfo = await ytdl.getInfo(argsMatch.input);
    const song = {
        title: songInfo.videoDetails.title,
        author: songInfo.videoDetails.author,
        url: songInfo.videoDetails.video_url,
        thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length]
    };

    const serverQueue = bot.audioQueue.get(message.guild.id);

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        bot.audioQueue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(bot.audioQueue, message.guild.id, queueConstruct.songs[0]);
        } catch (err) {
            console.log(err);
            bot.audioQueue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(
            `${song.title} has been added to the queue!`
        );
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