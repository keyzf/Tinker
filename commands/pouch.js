'use strict'

const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "pouch",
    aliases: ["bal", "balance"],
    category: "Adventuring",
    description: "See what you've got in your pouch",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.adventuring.pouch"],
    memberPermissions: ["command.adventuring.pouch"]
});

const preResponses = [
    "In amongst some odd buttons you see",
    "Is that a dead toad? and",
    "As you brush aside a used hankie you spot"
]

command.setExecute(async (client, message, args, cmd) => {
    const [dbTargetCurrency] = await client.data.db.query(`select currencyUnit0, currencyUnit1, currencyUnit2 from globalUser where userID='${message.author.id}'`);
    message.channel.send(client.operations.generateEmbed.run({
        author: `${message.author.username}'s Pouch`,
        authorUrl: message.author.displayAvatarURL(),
        description: preResponses[Math.floor(Math.random() * preResponses.length)],
        fields: [
            { name: "Gold Coins", value: dbTargetCurrency.currencyUnit2, inline: true },
            { name: "Silver Coins", value: dbTargetCurrency.currencyUnit1, inline: true },
            { name: "Copper Coins", value: dbTargetCurrency.currencyUnit0, inline: true }
        ],
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Property of", message.author, "")
    }));
});

module.exports = command;