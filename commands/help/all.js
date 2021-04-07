const Command = require("../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "all",
    aliases: [],
    category: "Bot",
    description: "Shows all commands",
    usage: ""
});

cmd.setLimits({
    cooldown: 1,
    limited: false
});

const {MessageEmbed} = require("discord.js");

cmd.setExecute(async (client, message, args, cmd) => {
    const {commands} = client;
    const [{prefix}] = await client.data.db.query(`select prefix from guilds where guildID='${message.guild.id}'`);

    const e = new MessageEmbed();
    e.setTimestamp();
    e.setTitle("All my commands!");
    e.setDescription(`Use \`${prefix}help command [Command Name]\` to get help with a specific command,
    or \`${prefix}help category [Category Name]\` to only see commands from a specified category.`)
    let outCommands = {};
    commands.array().forEach((item) => {
        if (!item.limits.limited || client.config.devs.includes(message.author.id)) {
            let category = item.info.category;
            if (!outCommands[category]) {
                outCommands[category] = [];
            }
            outCommands[category].push(item.info.name);
        }
    });
    let keys = Object.keys(outCommands);
    let values = Object.values(outCommands)
    for (let key in keys) {
        e.addField(keys[key] || "No category", values[key].join(", "));
    }
    message.channel.send(client.operations.generateEmbed.run({
        ...e,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
});

module.exports = cmd;