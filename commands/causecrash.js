'use strict'

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
    cooldown: 1
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["admin.command.causecrash"],
    memberPermissions: ["command.causecrash"]
});

command.setExecute(async(client, message, args, cmd) => {
    try {
        throw new Error("Intentional Error")
    } catch ({stack}) {
        client.logger.error(stack, { channel: message.channel, content: message.content, origin: __filename })
        const e = await client.operations.generateError.run(stack, "A dev asked me to do this... idk why", { channel: message.channel, content: message.content, origin: __filename });
        message.channel.send(e);
    }
});

module.exports = command;