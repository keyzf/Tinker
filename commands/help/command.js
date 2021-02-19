const Command = require("../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "command",
    aliases: [],
    category: "Bot",
    description: "Shows info on a specific command",
    usage: "<command / command path>"
});

cmd.setLimits({
    cooldown: 1,
    limited: false
});

const { MessageEmbed } = require("discord.js")
const { loopObjArr } = require("../../structures/utility/recursive");

cmd.setExecute(async(client, message, args, cmd) => {

    if (!args[0]) return message.channel.send('That\'s not a valid command!');
    const name = args[0].toLowerCase();
    const { commands } = client;
    let command = commands.get(name) || commands.find(c => c.info.aliases && c.info.aliases.includes(name));
    if (!command) return message.channel.send('That\'s not a valid command!');

    let path = [command.info.name]
    for (let i = 1; i < args.length; i++) {
        let all = [];
        loopObjArr(command, "subcommands", (elts) => {
            all = all.concat(elts);
        });
        command = all.find((elt) => elt.info.name == args[i]);
        if (!command) return message.channel.send("Sub command not found");
        path.push(command.info.name)
    }
    path = path.join(" > ");

    const { prefix } = client.data.db.prepare(`SELECT prefix FROM guilds WHERE guildID=?`).get(message.guild.id);

    const e = new MessageEmbed();
    e.setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL());
    e.setColor("#a700bd");
    e.setTimestamp();
    e.setTitle(path)
    e.setDescription(command.info.description || "No description set")
    e.addFields(
        { name: "Aliases", value: `${command.info.aliases.join(", ") || "No aliases set"}`,inline: true },
        { name: "Usage", value: `${(command.info.usage) ? prefix + command.info.name + " " + command.info.usage : "No usage advice"}`, inline: true },
        { name: "Cooldown", value: `${command.limits.cooldown || 0}s`, inline: true },
        { name: "Subcommands", value: `${command.subcommands.length ? command.subcommands.map((cmd) => { return cmd.info.name }).join(", ") : "No subcommands"}` }
    );
    return message.channel.send(e)
});

module.exports = cmd;