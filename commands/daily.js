const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "daily",
    aliases: [],
    category: "Adventuring",
    description: "Get your daily wage",
    usage: ""
});

command.setLimits({
    cooldown: 0,
    limited: false
});

command.setPerms({
    userPermissions: [],
    botPermissions: []
});


command.setExecute(async (client, message, args, cmd) => {
    const {lastDaily} = await client.data.db.getOne({
        table: "globalUser",
        fields: ["lastDaily"],
        conditions: [`userID='${message.author.id}'`]
    })
    if (client.timeManager.sameDay(new Date(lastDaily), new Date())) {
        return message.channel.send(client.operations.generateEmbed.run({
            description: "Nice try but you've had your daily allowance",
            colour: client.statics.colours.tinker
        }));
    }
    const val = client.utility.randomFromInterval(1, 5);
    const {currencyUnit1: oldVal} = await client.data.db.getOne({
        table: "globalUser",
        fields: ["currencyUnit1"],
        conditions: [`userID='${message.author.id}'`]
    })
    await client.data.db.set({
        table: "globalUser",
        field_data: {
            lastDaily: client.timeManager.timeToSqlDateTime(Date.now()),
            currencyUnit1: oldVal + val
        },
        conditions: [`userID='${message.author.id}'`]
    });
    return message.channel.send(client.operations.generateEmbed.run({
        description: `You earned ${val} Silver Piece${val > 1 ? "s" : ""} ${client.data.emojis.custom.silverCoin}`,
        colour: client.statics.colours.tinker
    }));
});

module.exports = command;