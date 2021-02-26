const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "simplepoll",
    aliases: ["poll"],
    category: "Poll",
    description: "Ask a thumbs up thumbs down question",
    usage: "<question>"
});

cmd.setLimits({
    cooldown: 2,
    limited: false
});

cmd.setPerms({
    botPermissions: ["MANAGE_MESSAGES"],
    userPermissions: ["MANAGE_MESSAGES"]
});

cmd.setExecute(async(client, message, args, cmd) => {
    let question = args.join(" ");
    if (!question) { return message.channel.send(`You did not specify a question!`); }

    const msg = await message.channel.send(client.operations.generateDefaultEmbed.run({
        title: "Poll",
        description: question,
        footerText: `Poll made by ${message.author.tag}`,
        footerUrl: message.author.displayAvatarURL()
    }));

    await msg.react("👍");
    await msg.react("👎");
    client.operations.deleteCatch.run(message);
});

module.exports = cmd;