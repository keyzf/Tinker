const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "livemanage",
    aliases: ["lm"],
    category: "DevOnly",
    description: "",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["admin.command.livemanage"],
    memberPermissions: ["command.livemanage"]
});

command.registerSubCommand(`${__dirname}/livemanage/command`);
command.registerSubCommand(`${__dirname}/livemanage/event`);
command.registerSubCommand(`${__dirname}/livemanage/operation`);
command.registerSubCommand(`${__dirname}/livemanage/static`);

command.setExecute(async (client, message, args, cmd) => {
    return message.channel.send("Type should equal `command`, `event`, `operation`, `static`");
});

module.exports = command;