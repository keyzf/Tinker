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
    cooldown: 5
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.adventuring.work"],
    memberPermissions: ["command.adventuring.work"]
});

command.setExecute(async(client, message, args, cmd) => {
    const [{ lastWork }] = await client.data.db.query(`select lastWork from globalUser where userID='${message.author.id}'`);

    if (client.timeManager.sameHour(new Date(), new Date(lastWork))) {
        return message.channel.send(client.operations.generateEmbed.run({
            description: "You can't get back to work yet.",
            colour: client.statics.colours.tinker
        }));
    }
    const val = client.utility.randomFromInterval(10, 30);
    const [{ currencyUnit0: oldVal }] = await client.data.db.query(`select currencyUnit0 from globalUser where userID='${message.author.id}'`);
    await client.data.db.query(`update globalUser set lastWork=?, currencyUnit0=? where userID='${message.author.id}'`, [client.timeManager.timeToSqlDateTime(new Date()), oldVal + val]);
    return message.channel.send(client.operations.generateEmbed.run({
        description: `You earned ${val} Copper Piece${val > 1 ? "s" : ""} ${client.data.emojis.custom.copperCoinStack}`,
        colour: client.statics.colours.tinker,
    }));
});

module.exports = command;