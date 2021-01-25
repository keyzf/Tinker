const figlet = require('figlet');

module.exports.run = async(bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) { return message.channel.send("You are not authorized to do this!"); }
    const text = args.join(" ");
    if (text.length == 0) { return message.channel.send("provide something to say") } else if (text.length > 15) { return message.channel.send("Too long") }
    let out;
    try {
        out = figlet.textSync(text, { horizontalLayout: 'full' })
    } catch (e) {
        logger.error(e, { channel: message.channel, content: message.content });
        return await message.channel.send(await bot.cevents.get("generateError").run(e, "Could not generate Ascii text"));
    }
    if (!out) { return message.channel.send("Your message consists of entirely unsupported characters") }
    return message.channel.send("```" + out + "```");
}
module.exports.help = {
    name: "asciiimagetext",
    aliases: ["imagetext"],
    description: "Print ASCII art text (max 15 characters)",
    usage: "message",
    cooldown: 1,
    inDev: false
};