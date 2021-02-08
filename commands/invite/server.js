const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "server",
    aliases: ["guild", "supportserver"],
    category: "Bot",
    description: "Get invite to Tinker Support Server",
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
    message.channel.send(client.config.officialServer.invite);
});

module.exports = command;