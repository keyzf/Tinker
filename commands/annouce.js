const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "announce",
    aliases: [],
    category: "Moderation",
    description: "Send an annoucement embed",
    usage: "<title> <message> <release time>"
});

command.setLimits({
    cooldown: 1,
    limited: true,
    limitMessage: "I know this was a feature of Tinker before the major update, however Im sure you'd much rather have a running bot!"
});

command.setPerms({
    userPermissions: ["MANAGE_MESSAGES"],
    botPermissions: []
});


command.setExecute(async (client, message, args, cmd) => {
    
});

module.exports = command;