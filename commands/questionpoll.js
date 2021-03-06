'use strict'

const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "questionpoll",
    aliases: ["qpoll"],
    category: "Poll",
    description: "Ask a poll with multiple choice answers",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    botPermissions: ["MANAGE_MESSAGES"],
    userPermissions: ["MANAGE_MESSAGES"],
    globalUserPermissions: ["user.command.poll.questionpoll"],
    memberPermissions: ["command.poll.questionpoll"]
});

command.setExecute(async(client, message, args, cmd) => {

    const question = args[0];
    if (!question) { return message.channel.send(`You did not specify a question!`); }

    const answers = args.splice(1, args.length);
    if(answers.length > 20) {return message.channel.send("Woah! Hold ya horses, too many answers there")}

    const msg = await message.channel.send(client.operations.generateEmbed.run({
        title: question,
        description: answers.reduce((accumulator, a) => {
            return accumulator += `\`${String.fromCharCode(answers.indexOf(a) + 65)}\` ${a}\n`;
        }, ""),
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Poll made by", message.author, "")
    }));

    answers.forEach(async(a) => {
        await msg.react(client.data.emojis.characterSet[String.fromCharCode(answers.indexOf(a) + 65)])
    });

    client.operations.deleteCatch.run(message);
});

module.exports = command;