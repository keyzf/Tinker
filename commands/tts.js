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
    limited: true,
    limitMessage: "I know a lot of you loved this but it was causing some issues on the backend. Don't worry! It will be coming back, I just need some time to sort out its issues"
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

    message.channel.send(client.operations.generateEmbed.run({
        title: "Now Saying",
        description: speech,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
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
            await message.channel.send(await client.operations.generateError.run(err, `Error occurred playing tts`));
            await fs.unlink(filepath);
            voiceChannel.leave();
        });
});

module.exports = command;