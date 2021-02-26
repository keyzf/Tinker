const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "error",
    aliases: ["err", "errs", "errors"],
    category: "Support Server",
    description: "Explain how errors work for the bot",
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
        description: `Sometimes the bot goes wrong and sends an error message along with a code
        You can use the command \`error\` to find out some information about it, however some information is limited to our support team for data privacy
        
        \`-\` If your ticket is directly related to an error then make sure to bring the code with you, it will hopefully make the support process much quicker

        `,
        author: "Tinker Support",
        authorUrl: "./res/TinkerQuestion-yellow.png",
        footerText: `Requested by ${message.author.tag}`,
        footerUrl: message.author.displayAvatarURL()
    }));
    message.delete({timeout:0});
});

module.exports = command;