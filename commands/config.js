const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "config",
    aliases: ["setup"],
    category: "Config",
    description: "Setup the bot",
    usage: ""
});

command.setLimits({
    cooldown: 0,
    limited: true // TODO remove when not in dev
});

command.setPerms({
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: []
});


command.setExecute(async (client, message, args, cmd) => {
    
});

module.exports = command;