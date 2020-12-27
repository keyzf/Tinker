const setResponses = require("../../data/setResponse");
const ytdl = require('ytdl-core');
const logger = require("../../lib/logger")

module.exports.run = async(bot, message, args) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send(setResponses.mustBeInVoiceChannel());

    const stream = ytdl('https://www.youtube.com/watch?v=1QWJ3BG7uyg', { filter: 'audioonly' });
    const connection = await voiceChannel.join();
    const dispatcher = connection.play(stream);

    // dispatcher.on('error', logger.error);

    dispatcher.on('finish', () => voiceChannel.leave());


}
module.exports.help = {
    name: 'voicetest',
    aliases: [],
    description: "Tests DevsApps voice sending",
    cooldown: 1,
    limit: true
};