const Command = require("../../structures/Command");
const command = new Command();

command.setInfo({
    name: "view",
    aliases: ["see", "look"],
    category: "Adventuring",
    description: "View the contents of your inventory",
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

command.setExecute(async(client, message, args, cmd) => {
    
});

module.exports = command;