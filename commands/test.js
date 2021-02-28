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
    limited: true
});

command.setPerms({
    userPermissions: [],
    botPermissions: []
});

command.setExecute(async(client, message, args, cmd) => {
    
    
});

module.exports = command;