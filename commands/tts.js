const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "tts",
    aliases: [],
    category: "DevOnly",
    description: "",
    usage: ""
});

command.setLimits({
    cooldown: 0,
    limited: true
});

command.setPerms({
    userPermissions: [],
    botPermissions: []
});


command.setExecute(async(client, message, args, cmd) => {
    const gtts = require('node-gtts')('en');
    const path = require('path');
    const filepath = path.join(__dirname, "..", "temp", `${client.utility.createUUID("tts-xxx-xxx")}.wav`);
    const fs = require("fs/promises");

    if (!args || !args.length) { return message.channel.send("I need something to say..."); }
    if (client.audioQueue.get(message.guild.id)) { return message.channel.send("You are already playing some music, stop that to continue"); }
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Gotta be in a vc");

    const speech = args.join(" ");

    message.channel.send(client.operations.get("generateDefaultEmbed")({
        title: "Now Saying",
        description: speech
    }));

    await client.utility.promisify.promisifyLastCallback(gtts.save, filepath, speech);
    client.logger.debug(`Source saved at ${filepath}`);
    client.logger.debug(`[TTS]: Guild: ${message.guild.id}`);

    const connection = await voiceChannel.join();
    const dispatcher = connection
        .play(filepath)
        .on("finish", async() => {
            client.logger.debug(`[TTS]: Guild: ${message.guild.id} finished`);
            await fs.unlink(filepath);
            voiceChannel.leave();
        })
        .on("error", async(error) => {
            client.logger.debug(`[TTS]: Guild: ${message.guild.id} disconnected`);
            client.logger.error(err, { channel: message.channel, content: message.content });
            await message.channel.send(await client.operations.get("generateError")(err, `Error occurred playing tts`));
            await fs.unlink(filepath);
            voiceChannel.leave();
        });
});

module.exports = command;