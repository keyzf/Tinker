const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "inventory",
    aliases: ["inv"],
    category: "Adventuring",
    description: "View and perform actions on your inventory",
    usage: ""
});

command.setLimits({
    cooldown: 1,
    limited: true
});

command.setPerms({
    botPermissions: [],
    userPermissions: []
});

command.registerSubCommand(`${__dirname}/inventory/view`);

command.setExecute(async(client, message, args, cmd) => {
    if(args.length) {
        return command.findSubcommand("view").run(message, args, cmd);
    }
});

module.exports = command;