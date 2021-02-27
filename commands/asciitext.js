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
    botPermissions: [],
    userPermissions: ["MANAGE_MESSAGES"]
});


const figlet = require("figlet")

cmd.setExecute(async(client, message, args, cmd) => {
    const text = args.join(" ");
    if (text.length == 0) { return message.channel.send("provide something to say") } else if (text.length > 15) { return message.channel.send("Too long") }
    let out;
    try {
        out = figlet.textSync(text, { horizontalLayout: 'full' })
    } catch (e) {
        client.logger.error(e, { channel: message.channel, content: message.content, origin: __filename });
        return await message.channel.send(await client.operations.generateError.run(e, "Could not generate Ascii text", { channel: message.channel, content: message.content, origin: __filename }));
    }
    if (!out) { return message.channel.send("Your message consists of entirely unsupported characters") }
    return message.channel.send("```" + out + "```");
});

module.exports = cmd;