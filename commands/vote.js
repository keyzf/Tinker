const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "vote",
    aliases: [],
    category: "Bot",
    description: "vote for some cool rewards",
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