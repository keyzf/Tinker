'use strict'

const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "character",
    aliases: ["char", "chars", "characters", "player", "players"],
    category: "Fun",
    description: "View and manage your character",
    usage: ""
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["indev.command.fun.character"],
    memberPermissions: ["command.fun.character"]
});

command.registerSubCommand(`${__dirname}/character/view`);
command.registerSubCommand(`${__dirname}/character/all`);
command.registerSubCommand(`${__dirname}/character/create`);
command.registerSubCommand(`${__dirname}/character/select`);
command.registerSubCommand(`${__dirname}/character/delete`);

command.setExecute(async(client, message, args, cmd) => {
    command.findSubcommand("view").run(message, args, cmd);
});

module.exports = command;