const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "invite",
    aliases: [],
    category: "Bot",
    description: "",
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

command.registerSubCommand(`${__dirname}/invite/bot`);
command.registerSubCommand(`${__dirname}/invite/server`);

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send(client.operations.generateDefaultEmbed.run({
       title: "My Invite Links",
       description: `[Server](${client.config.officialServer.invite}) - Tinker Support Server, get help, chat to the community, try out the bot!\n[Bot](${client.config.config.invite}) - Have Tinker for yourself!` 
    }))
});

module.exports = command;