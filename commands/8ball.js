const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "8ball",
    aliases: [],
    category: "Fun",
    description: "Get an answer from the almighty 8ball!",
    usage: "<question>"
});

cmd.setLimits({
    cooldown: 1,
    limited: false
});

cmd.setExecute(async(client, message, args, cmd) => {
    let question = args.join(" ")
    if (!question) { return message.channel.send(`You did not specify your question!`); }
    if (question.length > 1800) { return message.channel.send("Ask a slightly smaller question") } else {
        let response;
        try {
            response = client.utility.array_random(client.data.eightBall);
        } catch ({stack}) {
            client.logger.error(stack, { channel: message.channel, content: message.content, origin: __filename });
            return await message.channel.send(await client.operations.generateError.run(stack, "Could not get 8 Ball response from file", { channel: message.channel, content: message.content, origin: __filename }));
        }
        message.channel.send(await client.operations.generateEmbed.run({
            title: "8 Ball",
            description: `${question}\n${response}`,
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
        }));
    }
});

module.exports = cmd;