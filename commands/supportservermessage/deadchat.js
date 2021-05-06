'use strict'

const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "deadchat",
    aliases: [],
    category: "Support Server",
    description: "Explain why the chat is dead",
    usage: "[@ user]"
});

command.setLimits({
    cooldown: 0
});

command.setPerms({
    userPermissions: [],
    botPermissions: ["MANAGE_MESSAGES"],
    globalUserPermissions: ["support.command.supportservermessage.deadchat"],
    memberPermissions: ["command.supportservermessage.deadchat"]
});

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send(args.length ? args[0] : "", client.operations.generateEmbed.run({
        description: `We are aware the chat is dead. However this is a support server, not a place for casual hangout\n\nWe have these channels for your pleasure so:\n\n\`-\` Maybe say something interesting, it might strike up conversation\n\n\`-\` Go and find another server to complain about dead chats`,
        author: "Tinker Support",
        authorUrl: "./res/TinkerQuestion-yellow.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
    message.delete({timeout:0});
});

module.exports = command;