const Command = require("../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "badges",
    aliases: ["badge"],
    category: "Bot",
    description: "What are badges?",
    usage: ""
});

cmd.setLimits({
    cooldown: 1,
    limited: false
});


cmd.setExecute(async(client, message, args, cmd) => {
    return message.channel.send(client.operations.generateEmbed.run({
        title: "Badges",
        description: "Badges are shown for both users and servers. They are used by the bot to represent status, features, or identities of the user/server.\nBadges are managed solely by the bot and its developers, users cannot change or manage badges for themselves, others or guilds\nHowever users and guilds can earn themselves special badges in events, minigames, challenges, etc",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
});

module.exports = cmd;