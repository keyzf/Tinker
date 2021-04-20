const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "br",
    aliases: ["newline", "linebreak", "separator"],
    category: "Moderation",
    description: "Chat separator",
    usage: ""
});

cmd.setLimits({
    cooldown: 5
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: ["MANAGE_MESSAGES"],
    globalUserPermissions: ["user.command.moderation.br"],
    memberPermissions: ["command.moderation.br"]
});

cmd.setExecute(async(client, message, args, cmd) => {
    if (message.guild.me.permissions.has("MANAGE_MESSAGES")) {
        client.operations.deleteCatch.run(message);
    }
    message.channel.send("``` ```")
});

module.exports = cmd;