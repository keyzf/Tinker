const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "8ball",
    aliases: [],
    category: "Fun",
    description: "Get an answer from the almighty 8ball!",
    usage: "<question>"
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.fun.8ball"],
    memberPermissions: ["command.fun.8ball"]
})

command.setExecute(async(client, message, args, cmd) => {
    let question = args.join(" ")
    if (!question) { return message.channel.send(`Uhmmm bozo, you need to provide a question for me to answer, I can't read your mind! ${client.data.emojis.people.brain}`); }
    if (question.length > 1800) { return message.channel.send("Woah woah woah! Thats a lot to ask... maybe ask something slightly smaller?") } else {
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

module.exports = command;