'use strict'

const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "simplepoll",
    aliases: ["poll"],
    category: "Poll",
    description: "Ask a thumbs up thumbs down question",
    usage: "<question>"
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    botPermissions: ["MANAGE_MESSAGES"],
    userPermissions: ["MANAGE_MESSAGES"],
    globalUserPermissions: ["user.command.poll.simplepoll"],
    memberPermissions: ["command.poll.simplepoll"]
});

command.setExecute(async(client, message, args, cmd) => {
    let question = args.join(" ");
    if (!question) { return message.channel.send(`You did not specify a question!`); }

    const msg = await message.channel.send(client.operations.generateEmbed.run({
        title: "Poll",
        description: question,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Poll made by", message.author, "")
    }));

    await msg.react("👍");
    await msg.react("👎");
    client.operations.deleteCatch.run(message);
});

module.exports = command;