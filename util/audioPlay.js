const logger = require("../lib/logger");
const ytdl = require("ytdl-core");
const generateDefaultEmbed = require("./generateDefaultEmbed");

module.exports.play = (queue, guildID, song) => {
    const serverQueue = queue.get(guildID);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guildID);
        return serverQueue.textChannel.send(generateDefaultEmbed({ title: "Playback Finished", author: "Tinker's Tunes", authorUrl: "./res/TinkerMusic.png" }))
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url), { filter: "audioonly" })
        .on("finish", () => {
            serverQueue.songs.shift();
            this.play(queue, guildID, serverQueue.songs[0]);
        })
        .on("error", error => logger.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
    serverQueue.textChannel.send(generateDefaultEmbed({title:"Playing", description:`${song.title}`, author: "Tinker's Tunes", authorUrl: "./res/TinkerMusic.png"}))
}