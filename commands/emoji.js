'use strict'

const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "emoji",
    aliases: [],
    category: "Fun",
    description: "Gets an emoji",
    usage: ""
});

command.setLimits({
    cooldown: 5
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.fun.emoji"],
    memberPermissions: ["command.fun.emoji"]
});

// TODO: move away from subcommand system as writing out all subcommands for all emojis/gifs would be tedious and repeated code
command.registerSubCommand(`${__dirname}/emoji/bongocat`);

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send("Please specify an emoji");
    // TODO: List all emojis
});

module.exports = command;