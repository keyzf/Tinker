'use strict'

const Command = require("../../structures/Command");
const command = new Command();

command.setInfo({
    name: "command",
    aliases: [],
    category: "Bot",
    description: "Shows info on a specific command",
    usage: "<command / command path>"
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.bot.help.command"],
    memberPermissions: ["command.bot.help.command"]
});

const { MessageEmbed } = require("discord.js")
const { loopObjArr } = require("../../utility/recursive");

command.setExecute(async(client, message, args, cmd) => {

    if (!args[0]) return message.channel.send("That isn't a valid command!");
    const name = args[0].toLowerCase();
    const { commands } = client;
    let command = commands.get(name) || commands.find(c => c.info.aliases && c.info.aliases.includes(name));
    if (!command) return message.channel.send("That isn't a valid command!");

    let path = [command.info.name]
    for (let i = 1; i < args.length; i++) {
        let all = [];
        loopObjArr(command, "subcommands", (elts) => {
            all = all.concat(elts);
        });
        command = all.find((elt) => elt.info.name == args[i] || (elt.info.aliases && elt.info.aliases.includes(args[i])));
        if (!command) return message.channel.send("Subcommand not found.");
        path.push(command.info.name)
    }
    path = path.join(" > ");

    const [{ prefix }] = await client.data.db.query(`select prefix from guilds where guildID='${message.guild.id}'`);

    const e = new MessageEmbed();
    e.setTimestamp();
    e.setTitle(path)
    e.setDescription(command.info.description || "No description set")
    e.addFields({ name: "Aliases", value: `${command.info.aliases.join(", ") || "No aliases set"}`, inline: true }, { name: "Usage", value: `${(command.info.usage) ? prefix + command.info.name + " " + command.info.usage : "No usage advice"}`, inline: true }, { name: "Cooldown", value: `${command.limits.cooldown || 0}s`, inline: true }, { name: "Subcommands", value: `${command.subcommands.length ? command.subcommands.map((command) => { return command.info.name }).join(", ") : "No subcommands"}` });
    return message.channel.send(client.operations.generateEmbed.run({
        ...e,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
});

module.exports = command;