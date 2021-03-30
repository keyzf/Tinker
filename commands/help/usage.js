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
    cooldown: 1,
    limited: false
});


command.setExecute(async(client, message, args, cmd) => {
    const {prefix} = await client.data.db.getOne({
        table: "guilds",
        fields: ["prefix"],
        conditions: [`guildID='${message.guild.id}'`]
    });

    return message.channel.send(client.operations.generateEmbed.run({
        title: "The Usage String",
        description: "The usage string is very simple and easy to understand. Here's how:",
        fields: [
            { name: "Prefix", value: "The Usage String will always start with the servers prefix" },
            { name: "Command", value: "It will then be immediately followed by the full command name, however this can be swapped out for any of the aliases provided on the command's help page" },
            { name: "<Required>", value: "Arguments surrounded by `<>` angled brackets are required. You must fulfill these or the command cannot function properly" },
            { name: "[Optional]", value: "Arguments surrounded by `[]` square brackets are optional. You do not need to fulfill for the command to function properly, however doing so may provide additional functionality or produce a different result." },
            { name: "Arguments", value: "Usually you can tell what these args will do but if you are not sure, read the command help menu, ask another user or even come to our support server" },
            { name: "Example", value: `You ran the command \`${prefix}${cmd} usage\` to get here. \`prefix command [optional argument]\`` }
        ],
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
});

module.exports = command;