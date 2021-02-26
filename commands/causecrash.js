const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "causecrash",
    aliases: ["cc"],
    category: "DevOnly",
    description: "Throw an error",
    usage: ""
});

command.setLimits({
    cooldown: 1,
    limited: true
});

command.setPerms({
    userPermissions: [],
    botPermissions: []
});


command.setExecute(async(client, message, args, cmd) => {
    try {
        throw new Error("Intentional Error")
    } catch (err) {
        client.logger.error(err.stack, { channel: message.channel, content: message.content })
        const e = await client.operations.generateError.run(err.stack, "A dev asked me to do this... idk why", { channel: message.channel, content: message.content });
        message.channel.send(e);
    }
});

module.exports = command;