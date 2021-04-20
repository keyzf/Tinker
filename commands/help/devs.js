const Command = require("../../structures/Command");
const command = new Command();

command.setInfo({
    name: "devs",
    aliases: ["developers"],
    category: "Bot",
    description: "All my developers and contributors",
    usage: ""
});

command.setLimits({
    cooldown: 1,
    limited: false
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.bot.help.devs"],
    memberPermissions: ["command.bot.help.devs"]
});

command.setExecute(async(client, message, args, cmd) => {
    return message.channel.send(client.operations.generateEmbed.run({
        title: "The Tinker Team",
        description: "Here are all of the people involved in my development",
        fields: [
            { name: "Inanis#2432", value: "`Owner / Lead Dev` - Designed and programmed most of the features" },
            { name: "TechnoBiscuit#3540", value: "`Dev` - helped with development in general and came up with some ideas, Grammarly stand-in" },
            { name: "Dukemz#7766", value: "`Dev` - helped with development in general and came up with some ideas, Some crazy Grammar machine" },
        ],
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
});

module.exports = command;