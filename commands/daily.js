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
    cooldown: 0
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.adventuring.daily"],
    memberPermissions: ["command.adventuring.daily"]
});

command.setExecute(async(client, message, args, cmd) => {
    const [{ lastDaily }] = await client.data.db.query(`select lastDaily from globalUser where userID='${message.author.id}'`);
    if (client.timeManager.sameDay(new Date(lastDaily), new Date())) {
        return message.channel.send(client.operations.generateEmbed.run({
            description: "Nice try but you've had your daily allowance",
            colour: client.statics.colours.tinker
        }));
    }
    const val = client.utility.randomFromInterval(1, 5);
    const [{ currencyUnit1: oldVal }] = await client.data.db.query(`select currencyUnit1 from globalUser where userID='${message.author.id}'`);
    await client.data.db.query(`update globalUser set lastDaily=?, currencyUnit1=? where userID='${message.author.id}'`, [client.timeManager.timeToSqlDateTime(Date.now()), oldVal + val]);
    return message.channel.send(client.operations.generateEmbed.run({
        description: `You earned ${val} Silver Piece${val > 1 ? "s" : ""} ${client.data.emojis.custom.silverCoin}`,
        colour: client.statics.colours.tinker
    }));
});

module.exports = command;