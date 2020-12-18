const setResponses = require("../../data/setResponse");
const ytdl = require('ytdl-core');


module.exports.run = async(bot, message, args, dbGuild) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send(setResponses.mustBeInVoiceChannel());


    if (!args[0]) return message.channel.send(`${dbGuild.prefix}${this.help.name} ${this.help.usage}`)

    let input = args[0].match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/).input;
    if (!input) return message.channel.send("Thats not a real youtube link")
    const stream = ytdl(input, { filter: 'audioonly' });
    const connection = await voiceChannel.join();
    const dispatcher = connection.play(stream);

    dispatcher.on('finish', () => voiceChannel.leave());

}
module.exports.help = {
    name: 'play',
    aliases: [],
    description: "plays music from youtube given a link",
    usage: "\"[Full Link]\"",
    cooldown: 10,
    inDev: true
};