'use strict'

const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "perms",
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
    globalUserPermissions: ["admin.command.test.perms"],
    memberPermissions: ["command.test.perms"]
});

command.setExecute(async (client, message, args, cmd) => {

});

module.exports = command;