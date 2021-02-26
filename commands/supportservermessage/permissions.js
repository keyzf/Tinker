const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "permissions",
    aliases: ["perms"],
    category: "Support Server",
    description: "Explain how permissions work for the bot",
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
    message.channel.send(args.length ? args[0] : "", client.operations.generateDefaultEmbed.run({
        description: `For the bot to function properly quite a few permissions are needed,
        run the command \`perms\` to see the list, what they do and whether the bot has permissions to do it or not
        
        \`-\` The bot may say it has the correct perms but please make sure none of your channel overrides are changing the default role setting for the bot

        \`-\` Giving the permission \`ADMINISTRATOR\` allows the bot to do everything it needs without interference

        \`-\` Some functionality relies on the role order, for the best experience make sure the bot is as high up this structure as possible
        `,
        author: "Tinker Support",
        authorUrl: "./res/TinkerQuestion-yellow.png",
        footerText: `Requested by ${message.author.tag}`,
        footerUrl: message.author.displayAvatarURL()
    }));
    message.delete({timeout:0});
});

module.exports = command;