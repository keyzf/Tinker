'use strict'

const Command = require("../../structures/Command");
const command = new Command();

command.setInfo({
    name: "category",
    aliases: ["categories"],
    category: "Bot",
    description: "Info on a specific category",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.bot.help.category"],
    memberPermissions: ["command.bot.help.category"]
});

const { MessageEmbed } = require("discord.js");

command.setExecute(async(client, message, args, cmd) => {
    if (!args[0]) {
        return message.channel.send("Please provide a category")
    }

    const { commands } = client;

    const e = new MessageEmbed();
    e.setTimestamp();
    e.setTitle(`Commands found under category "${args.join(" ")}"`);

    let outCommands = {};
    commands.array().forEach((item) => {
        let category = item.info.category;
        if (category.toLowerCase() == args.join(" ").toLowerCase()) {
            if (!outCommands[item.info.name]) { outCommands[item.info.name] = []; }
            outCommands[item.info.name].push(item.info.description || "No description");
        }
    });
    let keys = Object.keys(outCommands);
    if (!keys.length) {
        e.setDescription("No commands found under that category");
    } else {
        let values = Object.values(outCommands)
        for (let key in keys) {
            e.addField(keys[key] || "No name", values[key].join(", "));
        }
    }

    message.channel.send(client.operations.generateEmbed.run({
        ...e,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
    // return message.channel.send(`Use \`${prefix}help command [Command Name]\` to get help with a specific command`);
});

module.exports = command;