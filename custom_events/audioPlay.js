const logger = require("../lib/logger");
const ytdl = require("ytdl-core");
const generateDefaultEmbed = require("../util/generateDefaultEmbed");
const ms = require("pretty-ms");

module.exports.run = (queue, guildID, song) => {
    const serverQueue = queue.get(guildID);

    if (!song) {
        logger.debug(`[Audio]: Guild: ${guildID} finished queue`)
        serverQueue.voiceChannel.leave();
        serverQueue.textChannel.send(generateDefaultEmbed({
            title: "Playback Finished",
            author: "Tinker's Tunes",
            authorUrl: "./res/TinkerMusic.png" }));
        return queue.delete(guildID);
    }

    logger.debug(`[Audio]: Guild: ${guildID} playing track ${song.title}`)
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url), { filter: "audioonly" })
        .on("finish", () => {
            serverQueue.songs.shift();
            this.run(queue, guildID, serverQueue.songs[0]);
        })
        .on("error", error => logger.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);

    serverQueue.textChannel.send(generateDefaultEmbed({
        title: "Now Playing",
        description: `[${serverQueue.songs[0].title}: ${serverQueue.songs[0].author} (${ms(parseInt(serverQueue.songs[0].lengthSeconds) * 1000)})](${serverQueue.songs[0].url})`,
        imageUrl: serverQueue.songs[0].thumbnail.url,
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic.png",
        footerText: `Song requested by ${serverQueue.songs[0].requestedBy.usertag}`,
        footerUrl: serverQueue.songs[0].requestedBy.avatar
    }));
}

module.exports.help = {
    name: "audioPlay"
}