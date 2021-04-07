const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "tts",
    aliases: [],
    category: "Music",
    description: "",
    usage: ""
});

command.setLimits({
    cooldown: 3,
    limited: false
});

command.setPerms({
    userPermissions: [],
    botPermissions: []
});

const gtts = require('node-gtts')('en');
const path = require('path');

command.setExecute(async(client, message, args, cmd) => {

    const filepath = path.join(__dirname, "..", "temp", `${client.utility.createUUID("tts-*x*x*x-*x*x*x")}.wav`);

    if (!args || !args.length) { return message.channel.send("I need something to say..."); }
    // if (client.audioQueue.get(message.guild.id)) { return message.channel.send("You are already playing some music, stop that to continue"); }
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Gotta be in a vc");

    const speech = args.join(" ");

    await client.utility.promisify.promisifyLastCallback(gtts.save, filepath, speech);
    client.logger.debug(`Source saved at ${filepath}`);
    client.logger.debug(`[TTS]: Guild: ${message.guild.id}`);


    const song = {
        content: speech,
        requestedBy: {
            usertag: message.author.tag,
            avatar: message.author.displayAvatarURL()
        },
        url: filepath,
        audioType: "tts"
    };

    const serverQueue = client.audioQueue.get(message.guild.id);
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 50,
            playing: true,
            timeoutUid: null
        };

        client.audioQueue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            queueConstruct.connection = await voiceChannel.join();
        } catch ({ stack }) {
            client.logger.error(stack);
            client.audioQueue.delete(message.guild.id);
            return message.channel.send(await client.operations.generateError.run(stack));
        }

        client.operations.audioPlay.run(message.guild.id, queueConstruct.songs[0]);

    } else {
        serverQueue.songs.push(song);

        if (serverQueue.playing) {
            return message.channel.send(await client.operations.generateEmbed.run({
                title: "TTS added to queue",
                description: `${speech}`,
                author: "Tinker's Tunes",
                authorUrl: "./res/TinkerTts.png",
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
            }));
        } else {
            client.operations.audioPlay.run(message.guild.id, serverQueue.songs[0]);
        }
    }
});

module.exports = command;