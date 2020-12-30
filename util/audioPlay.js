const logger = require("../lib/logger");
const ytdl = require("ytdl-core")

module.exports.play = (queue, guildID, song) => {
    const serverQueue = queue.get(guildID);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guildID);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url), { filter: "audioonly" })
        .on("finish", () => {
            serverQueue.songs.shift();
            this.play(queue, guildID, serverQueue.songs[0]);
        })
        .on("error", error => logger.error(error));
    // dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}