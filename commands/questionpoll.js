const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "questionpoll",
    aliases: ["qpoll"],
    category: "Poll",
    description: "Ask a poll with multiple choice answers",
    usage: ""
});

cmd.setLimits({
    cooldown: 1,
    limited: false
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

cmd.setExecute(async(client, message, args, cmd) => {

    const question = args[0];
    if (!question) { return message.channel.send(`You did not specify a question!`); }

    const answers = args.splice(1, args.length);
    if(answers.length > 20) {return message.channel.send("Woah! Hold ya horses, too many answers there")}

    const msg = await message.channel.send(client.operations.generateDefaultEmbed.run({
        title: question,
        description: answers.reduce((accumulator, a) => {
            return accumulator += `**${String.fromCharCode(answers.indexOf(a) + 65)}** ${a}\n`;
        }, ""),
        footerText: `Poll made by ${message.author.tag}`,
        footerUrl: message.author.displayAvatarURL()
    }));

    answers.forEach(async(a) => {
        await msg.react(client.data.emojis.characterSet[String.fromCharCode(answers.indexOf(a) + 65)])
    });

    client.operations.deleteCatch.run(message);
});

module.exports = cmd;