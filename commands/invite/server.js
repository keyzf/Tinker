const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "server",
    aliases: ["guild", "supportserver"],
    category: "Bot",
    description: "Get an invite to Tinker Support Server",
    usage: ""
});

command.setLimits({
    cooldown: 3
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.bot.invite.server"],
    memberPermissions: ["command.bot.invite.server"]
});

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send(client.config.officialServer.invite);
});

module.exports = command;
