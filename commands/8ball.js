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
        } catch (e) {
            client.logger.error(e, { channel: message.channel });
            return await message.channel.send(await bot.shardFunctions.get("generateError").run(e, "Could not get 8 Ball response from file"));
        }
        message.channel.send(await client.operations.get("generateDefaultEmbed")({
            title: "8 Ball",
            description: `You asked: ${question}\nMy reply: ${response}`
        }));
    }
});

module.exports = cmd;