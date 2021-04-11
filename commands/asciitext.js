const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "asciitext",
    aliases: [],
    category: "Fun",
    description: "Produce large text made from ascii non-letter characters",
    usage: "<text to display>"
});

cmd.setLimits({
    cooldown: 2,
    limited: false
});

cmd.setPerms({
    botPermissions: ["MANAGE_MESSAGES"],
    userPermissions: ["MANAGE_MESSAGES"]
});


const figlet = require("figlet")

cmd.setExecute(async(client, message, args, cmd) => {
    const text = args.join(" ");
    if (text.length == 0) { return message.channel.send("Provide something to say - if I could read your brain, do you think I'd be a Discord bot? No, me neither!") } else if (text.length > 15) { return message.channel.send("Really, you've got that much to say... just put it in a normal message") }
    let out;
    try {
        out = figlet.textSync(text, { horizontalLayout: 'full' })
    } catch (e) {
        client.logger.error(e, { channel: message.channel, content: message.content, origin: __filename });
        return await message.channel.send(await client.operations.generateError.run(e, "Could not generate Ascii text", { channel: message.channel, content: message.content, origin: __filename }));
    }
    if (!out) { return message.channel.send("Your message consists of entirely unsupported characters") }
    client.operations.deleteCatch.run(message);
    return message.channel.send("```" + out + "```");
});

module.exports = cmd;