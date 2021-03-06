'use strict'

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
    cooldown: 3
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.bot.invite"],
    memberPermissions: ["command.bot.invite"]
});

command.registerSubCommand(`${__dirname}/invite/bot`);
command.registerSubCommand(`${__dirname}/invite/server`);

command.setExecute(async(client, message, args, cmd) => {
    message.channel.send(client.operations.generateEmbed.run({
        title: "My Invite Links",
        description: `[Server](${client.config.officialServer.invite}) - Tinker Support Server, get help, chat to the community, try out the bot!\n[Bot](${client.config.config.invite}) - Have Tinker for yourself!`,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }))
});

module.exports = command;