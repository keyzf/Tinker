'use strict'

const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "permissions",
    aliases: ["perms", "perm"],
    category: "Moderation",
    description: "Remove messages from chat",
    usage: "<number>"
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["indev.command.bot.check.permissions"],
    memberPermissions: ["command.bot.check.permissions"]
});

command.setExecute(async(client, message, args, cmd) => {
    const globalUserPermissions = await client.permissionsManager.getGlobalBotUserPerms(message.author);
    const userPermissions = await client.permissionsManager.getBotUserPerms(message.guild, message.author);

    message.channel.send(client.operations.generateEmbed.run({
        title: "Permissions",
        fields: [{
                name: "Bot Wide",
                value: globalUserPermissions.permsList ? globalUserPermissions.permsList.map((elt) => elt[1]).join("\n") : "None"
            },
            {
                name: "Server Wide",
                value: userPermissions.permsList ? userPermissions.permsList.map((elt) => elt[1]).join("\n") : "None"
            }
        ],
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Permissions for", message.author, "")
    }));
});

module.exports = command;