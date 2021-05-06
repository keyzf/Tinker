'use strict'

const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "test",
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
    globalUserPermissions: ["admin.command.test"],
    memberPermissions: ["command.test"]
});

command.registerSubCommand(`${__dirname}/test/perms`);

command.setExecute(async(client, message, args, cmd) => {
    return message.channel.send("Welcome to the default handler! You are incompetent enough to not use a subcommand. Whoo!");
});

module.exports = command;