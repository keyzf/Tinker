const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "supportchannel",
    aliases: ["sc", "support"],
    category: "Support Server",
    description: "Notifies user of where to get support",
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
        description: `This is ***NOT*** a support channel
        If you need help with our bot then please use the channels below
        
        \`-\` <#806537032276508682> and see if your question is answered there

        \`-\` <#806918700452151358> check we are not already aware of you issue, if we are see the information about how to deal with it

        \`-\` <#806916670739972097> if you are still having issues, open a ticket
        `,
        author: "Tinker Support",
        authorUrl: "./res/TinkerQuestion-yellow.png",
        footerText: `Requested by ${message.author.tag}`,
        footerUrl: message.author.displayAvatarURL()
    }));
    message.delete({timeout:0});
});

module.exports = command;