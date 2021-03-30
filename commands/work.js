const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "work",
    aliases: [],
    category: "Adventuring",
    description: "Get to work",
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
    const {lastWork} = await client.data.db.getOne({
        table: "globalUser",
        fields: ["lastWork"],
        conditions: [`userID='${message.author.id}'`]
    });

    if (client.timeManager.sameHour(new Date(), new Date(lastWork))) {
        return message.channel.send(client.operations.generateEmbed.run({
            description: "You can't get back to work yet",
            colour: client.statics.colours.tinker
        }));
    }
    const val = client.utility.randomFromInterval(10, 30);
    const {currencyUnit0: oldVal} = await client.data.db.getOne({
        table: "globalUser",
        fields: ["currencyUnit0"],
        conditions: [`userID='${message.author.id}'`]
    })
    await client.data.db.set({
        table: "globalUser", field_data: {
            lastWork: client.timeManager.timeToSqlDateTime(Date.now()),
            currencyUnit0: oldVal + val
        }, conditions: [`userID='${message.author.id}'`]
    })
    return message.channel.send(client.operations.generateEmbed.run({
        description: `You earned ${val} Copper Piece${val > 1 ? "s" : ""} ${client.data.emojis.custom.copperCoinStack}`,
        colour: client.statics.colours.tinker,
    }));
});

module.exports = command;