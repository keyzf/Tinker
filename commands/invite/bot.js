const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "bot",
    aliases: ["tinker"],
    category: "Bot",
    description: "Get link to add Tinker",
    usage: ""
});

command.setLimits({
    cooldown: 3,
    limited: false
});

command.setPerms({
    userPermissions: [],
    botPermissions: []
});

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send(client.config.config.invite)
});

module.exports = command;