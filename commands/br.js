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
    cooldown: 1,
    limited: false
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

cmd.setExecute(async(client, message, args, cmd) => {
    message.channel.send("``` ```")
});

module.exports = cmd;