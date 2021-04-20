const Command = require("../../structures/Command");
const command = new Command();

command.setInfo({
    name: "usage",
    aliases: ["usagestring"],
    category: "Bot",
    description: "How to interpret a usage string",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.bot.help.usage"],
    memberPermissions: ["command.bot.help.usage"]
});

command.setExecute(async(client, message, args, cmd) => {
    const [{prefix}] = await client.data.db.query(`select prefix from guilds where guildID='${message.guild.id}'`);

    return message.channel.send(client.operations.generateEmbed.run({
        title: "The Usage String",
        description: "The usage string is very simple and easy to understand. Here's how:",
        fields: [
            { name: "Prefix", value: "The Usage String will always start with the servers prefix" },
            { name: "Command", value: "It will then be immediately followed by the full command name, however this can be swapped out for any of the aliases provided on the command's help page" },
            { name: "<Required>", value: "Arguments surrounded by `<>` angled brackets are required. You must fulfill these or the command cannot function properly" },
            { name: "[Optional]", value: "Arguments surrounded by `[]` square brackets are optional. You do not need to fulfill for the command to function properly, however doing so may provide additional functionality or produce a different result." },
            { name: "Arguments", value: "Usually you can tell what these args will do but if you are not sure, read the command help menu, ask another user or even come to our support server\nIf one argument requires multiple words (has spaces in it, like reasons for mod commands, parts of polls and character names) its a good idea to put it inside `\"\"` speech marks. This means that all the words within them shall be counted as one argument (one part of the command) avoiding the chance of misinterpretation from the bot." },
            { name: "Example", value: `You ran the command \`${prefix}${cmd} usage\` to get here. \`prefix command [optional argument]\`` }
        ],
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
});

module.exports = command;