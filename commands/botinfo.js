const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "botinfo",
    aliases: ["info"],
    category: "Bot",
    description: "Get information about the bot",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.bot.botinfo"],
    memberPermissions: ["command.bot.botinfo"]
});

command.setExecute(async(client, message, args, cmd) => {
    const botInfo = client.data.botInfo;
    message.channel.send(client.operations.generateEmbed.run({
        ...botInfo,
        colour: client.statics.colours.tinker
    }));
});

module.exports = command;