'use strict'

const Command = require("../../structures/Command");
const command = new Command();

command.setInfo({
    name: "event",
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
    globalUserPermissions: ["admin.command.livemanage.event"],
    memberPermissions: ["command.livemanage.event"]
});

command.registerSubCommand(`${__dirname}/event/add`);
command.registerSubCommand(`${__dirname}/event/remove`);
command.registerSubCommand(`${__dirname}/event/reload`);

command.setExecute(async (client, message, args, cmd) => {
   message.channel.send("Please specify, `add` `remove` or `reload`");
});

module.exports = command;