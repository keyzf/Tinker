const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "livemanage",
    aliases: ["lm"],
    category: "DevOnly",
    description: "",
    usage: ""
});

cmd.setLimits({
    cooldown: 0,
    limited: true
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

cmd.registerSubCommand(`${__dirname}/livemanage/command`);
cmd.registerSubCommand(`${__dirname}/livemanage/event`);
cmd.registerSubCommand(`${__dirname}/livemanage/operation`);

cmd.setExecute(async (client, message, args, cmd) => {
    return message.channel.send("Type should equal `command`, `event` or `operation`");
});

module.exports = cmd;