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
    cooldown: 0
});

command.setPerms({
    userPermissions: [],
    botPermissions: ["MANAGE_MESSAGES"],
    globalUserPermissions: ["support.command.supportservermessage.supportchannel"],
    memberPermissions: ["command.supportservermessage.supportchannel"]
});

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send(args.length ? args[0] : "", client.operations.generateEmbed.run({
        description: `This is ***NOT*** a support channel\nIf you need help with our bot then please use the channels below\n\n\`-\` <#806537032276508682> and see if your question is answered there\n\n\`-\` <#806918700452151358> check we are not already aware of your issue. If we are, see the information about how to deal with it\n\n\`-\` <#806916670739972097> if you are still having issues, open a ticket`,
        author: "Tinker Support",
        authorUrl: "./res/TinkerQuestion-yellow.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
    message.delete({timeout:0});
});

module.exports = command;