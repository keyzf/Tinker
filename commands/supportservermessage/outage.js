const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "outage",
    aliases: ["botOutage", "offline"],
    category: "Support Server",
    description: "Notifies user of offline",
    usage: "[@ user]"
});

command.setLimits({
    cooldown: 0
});

command.setPerms({
    userPermissions: [],
    botPermissions: ["MANAGE_MESSAGES"],
    globalUserPermissions: ["support.command.supportservermessage.outage"],
    memberPermissions: ["command.supportservermessage.outage"]
});

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send(args.length ? args[0] : "", client.operations.generateEmbed.run({
        description: `We are aware of some issues with the bot currently and are looking into getting it functioning again soon\n\n\`-\` Keep an eye on <#716609954290729062> for any updates about the bots status\n\n\`-\` Maybe the issue is currently with discord itself <#816731010547843102>\n\n\`-\` Otherwise, the best thing to do is wait`,
        author: "Tinker Support",
        authorUrl: "./res/TinkerQuestion-yellow.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
    message.delete({timeout:0});
});

module.exports = command;