const deleteCatch = require("../../util/deleteCatch");

module.exports.run = async(bot, message, args, dbGuild, cmd) => {

    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
        return message.channel.send(`You do not have permission to use this command`);
    }

    const question = args[0];
    if (!question) { return message.channel.send(`You did not specify a question!`); }

    const answers = args.splice(1, args.length)

    bot.cevents.get("generateQuestionPoll").run(message.channel, question, answers, message.author)

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