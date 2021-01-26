const { characterSet } = require("../../data/emoji_list.json");
const generateDefaultEmbed = require("../../util/generateDefaultEmbed");

module.exports.run = async (bot, channel, question, answers, author) => {

    const msg = await channel.send(generateDefaultEmbed({
        title: question,
        description: answers.reduce((accumulator, a) => {
            return accumulator += `**${String.fromCharCode(answers.indexOf(a) + 65)}** ${a}\n`;
        }, ""),
        footerText: `Poll made by ${author.tag}`,
        footerUrl: author.displayAvatarURL()
    }));

    answers.forEach(async(a) => {
        await msg.react(characterSet[String.fromCharCode(answers.indexOf(a) + 65)])
    });

    return msg;
}

module.exports.help = {
    name: "generateQuestionPoll"
}