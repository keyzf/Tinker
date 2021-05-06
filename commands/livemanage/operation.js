'use strict'

const Command = require("../../structures/Command");
const command = new Command();

command.setInfo({
    name: "operation",
    aliases: ["op"],
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
    globalUserPermissions: ["admin.command.livemanage.operation"],
    memberPermissions: ["command.livemanage.operation"]
});

command.registerSubCommand(`${__dirname}/operation/add`);
command.registerSubCommand(`${__dirname}/operation/remove`);
command.registerSubCommand(`${__dirname}/operation/reload`);

command.setExecute(async (client, message, args, cmd) => {
   message.channel.send("Please specify, `add` `remove` or `reload`");
});

module.exports = command;