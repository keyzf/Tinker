'use strict'

const Command = require("../../structures/Command");
const command = new Command();

command.setInfo({
    name: "static",
    aliases: [],
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
    globalUserPermissions: ["admin.command.livemanage.static"],
    memberPermissions: ["command.livemanage.static"]
});

command.registerSubCommand(`${__dirname}/static/add`);
command.registerSubCommand(`${__dirname}/static/remove`);
command.registerSubCommand(`${__dirname}/static/reload`);

command.setExecute(async (client, message, args, cmd) => {
   message.channel.send("Please specify, `add` `remove` or `reload`");
});

module.exports = command;