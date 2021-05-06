'use strict'

const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "clear",
    aliases: ["purge"],
    category: "Moderation",
    description: "Remove messages from chat",
    usage: "<number>"
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    userPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["MANAGE_MESSAGES"],
    globalUserPermissions: ["user.command.moderation.clear"],
    memberPermissions: ["command.moderation.clear"]
});

command.setExecute(async(client, message, args, cmd) => {
    try { count = parseInt(args[0]); } catch { count = 1 }

    await message.delete();
    try {
        await message.channel.bulkDelete(count);
        return message.channel.send(client.operations.generateEmbed.run({
            description: `Deleted ${count} messages`,
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Deleted by", message.author)
        })).then((m) => { client.operations.deleteCatch.run(m, 3000) });
    } catch (err) {
        client.operations.generateError.run(err, "Failed to remove messages", { channel: message.channel, content: message.content });
        return message.channel.send(client.operations.generateEmbed.run({ title: `Could not delete messages`, description: `: ${err}` })).then((m) => { client.operations.deleteCatch.run(m, 3000) });
    }
});

module.exports = command;