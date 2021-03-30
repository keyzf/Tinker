const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "test",
    aliases: [],
    category: "DevOnly",
    description: "",
    usage: ""
});

command.setLimits({
    cooldown: 0,
    limited: true,
    limitMessage: "What do you think you are testing..."
});

command.setPerms({
    userPermissions: [],
    botPermissions: []
});

command.registerSubCommand(`${__dirname}/test/timer`);
command.registerSubCommand(`${__dirname}/test/canceltimer`);

command.setExecute(async(client, message, args, cmd) => {
    return message.channel.send("Welcome to the default handler! You are incompetent enough to not use a subcommand. Whoo!");
});

module.exports = command;