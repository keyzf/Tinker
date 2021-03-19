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
    cooldown: 0,
    limited: true
});

command.setPerms({
    userPermissions: [],
    botPermissions: ["MANAGE_MESSAGES"]
});

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send(args.length ? args[0] : "", client.operations.generateEmbed.run({
        description: `We are aware of some issues with the bot currently and are looking into getting it functioning again soon
        
        \`-\` Keep an eye on <#716609954290729062> for any updates about the bots status

        \`-\` Maybe the issue is currently with discord itself <#816731010547843102>

        \`-\` Otherwise, the best thing to do is wait
        `,
        author: "Tinker Support",
        authorUrl: "./res/TinkerQuestion-yellow.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
    message.delete({timeout:0});
});

module.exports = command;