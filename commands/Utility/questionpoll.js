const generateDefaultEmbed = require("../../util/generateDefaultEmbed");
const deleteCatch = require("../../util/deleteCatch");
const { characterSet } = require("../../data/emoji_list.json");

module.exports.run = async(bot, message, args, dbGuild, cmd) => {

    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
        return message.channel.send(`You do not have permission to use this command`);
    }

    const question = args[0];
    if (!question) { return message.channel.send(`You did not specify a question!`); }

    const answers = args.splice(1, args.length)

    const msg = await message.channel.send(generateDefaultEmbed({
        title: question,
        description: answers.reduce((accumulator, a) => {
            return accumulator += `**${String.fromCharCode(answers.indexOf(a) + 65)}** ${a}\n`;
        }, ""),
        footerText: `Poll made by ${message.author.tag}`,
        footerUrl: message.author.displayAvatarURL()
    }));

    answers.forEach(async(a) => {
        await msg.react(characterSet[String.fromCharCode(answers.indexOf(a) + 65)])
    });

    deleteCatch(message);

}

module.exports.help = {
    name: "questionpoll",
    aliases: ["qpoll"],
    description: "Create a question poll",
    usage: "\"[question]\" \"[answer]\" \"[answer]\"...",
    cooldown: 1,
    inDev: false,
    generated: true
}