const generateDefaultEmbed = require("../../util/generateDefaultEmbed");
const deleteCatch = require("../../util/deleteCatch");

module.exports.run = async(bot, message, args, dbGuild, cmd) => {

    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
        return message.channel.send(`You do not have permission to use this command`);
    }

    let question = args.join(" ");
    if (!question) { return message.channel.send(`You did not specify a question!`); }


    let msg = await message.channel.send(generateDefaultEmbed({
        title: "Poll",
        description: question,
        footerText: `Poll made by ${message.author.tag}`,
        footerUrl: message.author.displayAvatarURL()
    }));

    await msg.react("👍");
    await msg.react("👎");
    deleteCatch(message);

}

module.exports.help = {
    name: "simplepoll",
    aliases: ["poll"],
    description: "Create a simple yes or no poll",
    usage: "[Yes no question]",
    cooldown: 1,
    inDev: false,
    generated: true
}