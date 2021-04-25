const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "help",
    aliases: ["h"],
    category: "Bot",
    description: "Shows you help on how to use the bot",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.bot.help"],
    memberPermissions: ["command.bot.help"]
});

command.registerSubCommand(`${__dirname}/help/all`);
command.registerSubCommand(`${__dirname}/help/command`);
command.registerSubCommand(`${__dirname}/help/category`);
command.registerSubCommand(`${__dirname}/help/usage`);
command.registerSubCommand(`${__dirname}/help/devs`);
command.registerSubCommand(`${__dirname}/help/badges`);

const {MessageEmbed} = require("discord.js");

command.setExecute(async(client, message, args, cmd) => {
    if (args.length) {
        return command.findSubcommand("command").run(message, args, cmd);
    }
    
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

module.exports = command;