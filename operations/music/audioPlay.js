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

op.setExecute(async (client, guildID, song) => {
    const serverQueue = client.audioQueue.get(guildID);

    if (!op.checkPerms(serverQueue.textChannel.guild, serverQueue.textChannel)) {
        return;
    }
    if (serverQueue.timeoutUid) {
        client.timeoutManager.deleteTimer(serverQueue.timeoutUid);
    }
    serverQueue.playing = true;

    if (!song) {
        client.logger.debug(`[Audio]: Guild: ${guildID} finished queue`);
        serverQueue.playing = false;
        serverQueue.textChannel.send(await client.operations.generateEmbed.run({
            title: "Playback Finished",
            author: "Tinker's Tunes",
            authorUrl: "./res/TinkerMusic-purple.png",
            colour: client.statics.colours.tinker
        }));

        if (!serverQueue.voiceChannel) {
            return;
        }

        const timer = client.timeoutManager.createTimer(2 * 60 * 1000); // timeout after 2 minutes
        serverQueue.timeoutUid = timer.uid;
        timer.on("fire", () => {
            serverQueue.textChannel.send(client.operations.generateEmbed.run({
                title: "Goodbye!",
                description: "No one has played anything for a while",
                author: "Tinker's Tunes",
                authorUrl: "./res/TinkerMusic-purple.png",
                colour: client.statics.colours.tinker
            }));
            serverQueue.voiceChannel.leave();
        });
        return;
    }

    client.logger.debug(`[Audio]: Guild: ${guildID} playing track ${song.title}`)
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url, {filter: "audioonly"}))
        .on("finish", () => {
            serverQueue.songs.shift();
            op.run(guildID, serverQueue.songs[0]);
        })
        .on("error", async (error) => {
            client.logger.error(error);
            client.logger.debug(`[Audio]: Guild: ${guildID} disconnected`);
            serverQueue.textChannel.send(await client.operations.generateEmbed.run({
                title: "Error Occurred",
                author: "Tinker's Tunes",
                authorUrl: "./res/TinkerMusic-purple.png",
                colour: client.statics.colours.tinker
            }));
            serverQueue.voiceChannel.leave();
            return client.audioQueue.delete(guildID);
        });
    serverQueue.connection.on("disconnect", async () => {
        client.logger.debug(`[Audio]: Guild: ${guildID} disconnected`);
        if (serverQueue.timeoutUid) {
            client.timeoutManager.deleteTimer(serverQueue.timeoutUid);
        }
        if (!serverQueue.playing) {
            return client.audioQueue.delete(guildID);
        }
        serverQueue.textChannel.send(await client.operations.generateEmbed.run({
            title: "Forcefully Disconnected by user",
            author: "Tinker's Tunes",
            authorUrl: "./res/TinkerMusic-purple.png",
            colour: client.statics.colours.tinker
        }));
        return client.audioQueue.delete(guildID);
    })
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);

    serverQueue.textChannel.send(await client.operations.generateEmbed.run({
        title: "Now Playing",
        description: `[${serverQueue.songs[0].title}: ${serverQueue.songs[0].author} (${ms(parseInt(serverQueue.songs[0].lengthSeconds) * 1000)})](${serverQueue.songs[0].url})`,
        imageUrl: serverQueue.songs[0].thumbnail.url,
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic-purple.png",
        colour: client.statics.colours.tinker,
        footerText: `Song requested by ${serverQueue.songs[0].requestedBy.usertag}`,
        footerUrl: serverQueue.songs[0].requestedBy.avatar
    }));
});

module.exports = op;