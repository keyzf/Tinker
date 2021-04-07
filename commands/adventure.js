const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "adventure",
    aliases: [],
    category: "Fun",
    description: "",
    usage: ""
});

cmd.setLimits({
    cooldown: 5,
    limited: true,
    limitedMsg: "This was requested in the Official Tinker Server and development for it has only begun recently. Its not available yet but lets hope it comes soon!"
});

cmd.setPerms({
    botPermissions: ["MANAGE_MESSAGES"],
    userPermissions: []
});

const Adventure = require("../structures/games/Adventure");

cmd.setExecute(async (client, message, args, cmd) => {
    const m = await message.channel.send(client.operations.generateEmbed.run({
        title: `${client.emojiHelper.sendWith(client.data.emojis.custom.loading)} Setting up`,
        author: "Tinker's Adventures",
        authorUrl: "./res/TinkerAdventure.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));

    

});

module.exports = cmd;