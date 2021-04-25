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
    cooldown: 0
});

command.setPerms({
    userPermissions: [],
    botPermissions: ["MANAGE_MESSAGES"],
    globalUserPermissions: ["support.command.supportservermessage.error"],
    memberPermissions: ["command.supportservermessage.error"]
});

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send(args.length ? args[0] : "", client.operations.generateEmbed.run({
        description: `Sometimes the bot goes wrong and sends an error message along with a code\n\nYou can use the command \`error\` to find out some information about it, however some information is limited to our support team for data privacy\n\n\`-\` If your ticket is directly related to an error then make sure to bring the code with you, it will hopefully make the support process much quicker`,
        author: "Tinker Support",
        authorUrl: "./res/TinkerQuestion-yellow.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
    message.delete({timeout:0});
});

module.exports = command;