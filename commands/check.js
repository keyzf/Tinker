const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "check",
    aliases: [],
    category: "Bot",
    description: "Check / Test something",
    usage: ""
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["indev.command.bot.check"],
    memberPermissions: ["command.bot.check"]
});

command.registerSubCommand(`${__dirname}/check/permissions`);

command.setExecute(async(client, message, args, cmd) => {
    message.channel.send("Nothing here yet :)");
});

module.exports = command;