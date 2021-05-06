'use strict'

const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "error",
    aliases: ["errors", "err", "errs"],
    category: "Bot",
    description: "View and manage errors the bot has",
    usage: "[instruction] <error code>"
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.bot.error"],
    memberPermissions: ["command.bot.error"]
});

command.registerSubCommand(`${__dirname}/error/remove`);
command.registerSubCommand(`${__dirname}/error/all`);

command.setExecute(async(client, message, args, cmd) => {
    if (!args[0]) { return message.channel.send("Please provide an error code"); }

    client.data.errordb.findOne({ _id: args[0] }).then(async(found) => {
        let e = {
            title: `Error Code ${args[0]}`
        }
        if (!found) {
            e.description = "No error with that code could be found"
        } else {
            const globalUserPerms = await client.permissionsManager.getGlobalBotUserPerms(message.author);
            if (globalUserPerms.has("error.view")) {
                e.description = `\`\`\`js\n${found.error} \`\`\``
                e.fields = [
                    { name: "Timestamp", value: new Date(found.timestamp).toLocaleString() },
                    { name: "User Message", value: found.userMsg }
                ];
                if (found.data) {
                    if (found.data.content) { e.fields.push({ name: "Content", value: `\`\`\`${found.data.content}\`\`\`` }) }
                    if (found.data.messageSource) { e.fields.push({ name: "source", value: found.data.messageSource }) }
                    if (found.data.origin) { e.fields.push({ name: "origin", value: `\`\`\`${found.data.origin}\`\`\`` }) }
                }
            } else if (found.userMsg) {
                e.description = found.userMsg
                e.fields = [{ name: "Well?", value: "The error has been logged, please contact us and give us the error code" }]
            } else {
                e.description = "The error has been logged, please contact us and give us the error code"
            }
        }
        try {
            message.channel.send(client.operations.generateEmbed.run(e));
        } catch ({ stack }) {
            client.logger.error(stack, { channel: message.channel, content: message.content, origin: __filename })
            return await message.channel.send(
                await client.operations.generateError.run(
                    stack, "Error likely too large", { channel: message.channel, content: message.content, origin: __filename }
                )
            );
        }
    }).catch(async({stack}) => {
        client.logger.error(stack, { channel: message.channel, content: message.content, origin: __filename })
        return await message.channel.send(
            await client.operations.generateError.run(
                stack, "Error trying to receive error info, ironic I know", { channel: message.channel, content: message.content, origin: __filename }
            )
        );
    });
});

module.exports = command;