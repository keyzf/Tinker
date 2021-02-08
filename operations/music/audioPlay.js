const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "audioPlay"
});

op.setPerms({
    botPermissions: ["CONNECT", "SPEAK"]
});

const ytdl = require("ytdl-core");
const ms = require("pretty-ms");

op.setExecute(async(client, guildID, song) => {
    const serverQueue = client.audioQueue.get(guildID);

    if(!op.checkPerms(serverQueue.textChannel.guild, serverQueue.textChannel)) {return;}

    if (!song) {
        client.logger.debug(`[Audio]: Guild: ${guildID} finished queue`);
        serverQueue.voiceChannel.leave();
        serverQueue.textChannel.send(await client.operations.get("generateDefaultEmbed")({
            title: "Playback Finished",
            author: "Tinker's Tunes",
            authorUrl: "./res/TinkerMusic-purple.png"
        }));
        return client.audioQueue.delete(guildID);
    }

    client.logger.debug(`[Audio]: Guild: ${guildID} playing track ${song.title}`)
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url, { filter: "audioonly" }))
        .on("finish", () => {
            serverQueue.songs.shift();
            op.run(guildID, serverQueue.songs[0]);
        })
        .on("error", async (error) => {
            client.logger.error(error);
            client.logger.debug(`[Audio]: Guild: ${guildID} disconnected`);
            serverQueue.textChannel.send(await client.operations.get("generateDefaultEmbed")({
                title: "Error Occurred",
                author: "Tinker's Tunes",
                authorUrl: "./res/TinkerMusic-purple.png"
            }));
            return client.audioQueue.delete(guildID);
        });
    serverQueue.connection.on("disconnect", async() => {
        client.logger.debug(`[Audio]: Guild: ${guildID} disconnected`);
        if (client.audioQueue.get(guildID)) return;
        serverQueue.textChannel.send(await client.operations.get("generateDefaultEmbed")({
            title: "Forcefully Disconnected by user",
            author: "Tinker's Tunes",
            authorUrl: "./res/TinkerMusic-purple.png"
        }));
        return client.audioQueue.delete(guildID);
    })
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);

    serverQueue.textChannel.send(await client.operations.get("generateDefaultEmbed")({
        title: "Now Playing",
        description: `[${serverQueue.songs[0].title}: ${serverQueue.songs[0].author} (${ms(parseInt(serverQueue.songs[0].lengthSeconds) * 1000)})](${serverQueue.songs[0].url})`,
        imageUrl: serverQueue.songs[0].thumbnail.url,
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic-purple.png",
        footerText: `Song requested by ${serverQueue.songs[0].requestedBy.usertag}`,
        footerUrl: serverQueue.songs[0].requestedBy.avatar
    }));
});

module.exports = op;