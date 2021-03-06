const Command = require("../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "category",
    aliases: ["categories"],
    category: "Bot",
    description: "Info on a specific category",
    usage: ""
});

cmd.setLimits({
    cooldown: 1,
    limited: false
});

const { MessageEmbed } = require("discord.js");

cmd.setExecute(async(client, message, args, cmd) => {
    if (!args[0]) {
        return message.channel.send("Please provide a category")
    }

    const { commands } = client;

    const e = new MessageEmbed();
    e.setTimestamp();
    e.setTitle(`Commands found under category "${args.join(" ")}"`);

    let outCommands = {};
    commands.array().forEach((item) => {
        if (!item.limits.limited || client.config.devs.includes(message.author.id)) {
            let category = item.info.category;
            if (category.toLowerCase() == args.join(" ").toLowerCase()) {
                if (!outCommands[item.info.name]) { outCommands[item.info.name] = []; }
                outCommands[item.info.name].push(item.info.description);
            }
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

module.exports = cmd;