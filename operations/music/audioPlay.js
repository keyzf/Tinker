const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "audioPlay"
});

op.setPerms({
    botPermissions: ["CONNECT", "SPEAK"]
});

const ytdl = require("ytdl-core");
const ytdlDiscord = require('ytdl-core-discord');
const ms = require("pretty-ms");

const fs = require("fs/promises");

op.setExecute(async(client, guildID, song) => {
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

    let dispatcher;
    if(song.audioType == "yt") {
        client.logger.debug(`[Audio]: Guild: ${guildID} playing track ${song.title}`);
        // dispatcher = serverQueue.connection.play(ytdl(song.url, { filter: "audioonly" }));
        dispatcher = serverQueue.connection.play(await ytdlDiscord(song.url), { highWaterMark: 50, type: "opus" });
    } else if(song.audioType == "tts") {
        client.logger.debug(`[Audio]: Guild: ${guildID} playing tts`);
        dispatcher = serverQueue.connection.play(song.url);
    }
    
    dispatcher.on("finish", async () => {
            if(song.audioType == "tts") {
                await fs.unlink(song.url);
            }
            serverQueue.songs.shift();
            op.run(guildID, serverQueue.songs[0]);
        })
        dispatcher.on("error", async(error) => {
            client.logger.error(error.stack);
            client.logger.debug(`[Audio]: Guild: ${guildID} disconnected`);
            if(song.audioType == "tts") {
                await fs.unlink(song.url);
            }
            serverQueue.textChannel.send(client.operations.generateEmbed.run({
                title: "Error Occurred",
                description: error,
                author: "Tinker's Tunes",
                authorUrl: "./res/TinkerMusic-purple.png",
                colour: client.statics.colours.tinker
            }));
            serverQueue.playing = false;
            serverQueue.voiceChannel.leave();
            return client.audioQueue.delete(guildID);
        });
    serverQueue.connection.on("disconnect", async() => {
        client.logger.debug(`[Audio]: Guild: ${guildID} disconnected`);
        if (serverQueue.timeoutUid) {
            client.timeoutManager.deleteTimer(serverQueue.timeoutUid);
        }

        if(song.audioType == "tts") {
            fs.unlink(song.url);
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

    if (song.audioType == "yt") {
        serverQueue.textChannel.send(await client.operations.generateEmbed.run({
            title: "Now Playing",
            description: `[${song.title ? song.title : ""}${song.author ? `: ${song.author}` : ""} ${song.lengthSeconds ? `(${ms(parseInt(song.lengthSeconds) * 1000)})` : "" } ](${song.url})`,
            imageUrl: song.thumbnail.url,
            author: "Tinker's Tunes",
            authorUrl: "./res/TinkerMusic-purple.png",
            colour: client.statics.colours.tinker,
            footerText: `Song requested by ${song.requestedBy.usertag}`,
            footerUrl: song.requestedBy.avatar
        }));
    } else if (song.audioType == "tts") {
        serverQueue.textChannel.send(await client.operations.generateEmbed.run({
            title: "Now Saying",
            description: song.content,
            author: "Tinker TTS",
            authorUrl: "./res/TinkerTts.png",
            colour: client.statics.colours.tinker,
            footerText: `Spoken by ${song.requestedBy.usertag}`,
            footerUrl: song.requestedBy.avatar
        }));
    } else {
        serverQueue.textChannel.send(await client.operations.generateEmbed.run({
            description: `Unknown audioType ${song.audioType}`,
            author: "Tinker's Tunes",
            authorUrl: "./res/TinkerExclamation-red.png",
            colour: client.statics.colours.tinker,
            footerText: `Requested by ${song.requestedBy.usertag}`,
            footerUrl: song.requestedBy.avatar
        }));
    }
});

module.exports = op;