const Command = require(`../../structures/Command`);
const cmd = new Command();

cmd.setInfo({
    name: "prefix",
    aliases: [],
    category: "Config",
    description: "Change the bot prefix",
    usage: ""
});

cmd.setLimits({
    cooldown: 3,
    limited: false
});

cmd.setPerms({
    userPermissions: [],
    botPermissions: []
});


cmd.setExecute(async(client, message, args, cmd) => {
    
});

module.exports = cmd;