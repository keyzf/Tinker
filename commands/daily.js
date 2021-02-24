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

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

command.setExecute(async(client, message, args, cmd) => {
    const { lastDaily } = client.data.db.prepare("SELECT lastDaily FROM currency WHERE userID=?").get(message.author.id);
    if (sameDay(new Date(lastDaily), new Date())) {
        return message.channel.send(client.operations.get("generateDefaultEmbed")({
            description: "Nice try but you've had your daily allowance"
        }));
    }
    const val = client.utility.randomFromInterval(1, 5);
    client.data.db.prepare("UPDATE currency SET lastDaily=?, currencyUnit1=? WHERE userID=?").run(Date.now(), val, message.author.id);
    return message.channel.send(client.operations.get("generateDefaultEmbed")({
        description: `You earned ${val} Silver Piece${val > 1 ? "s" : "" } ${client.data.emojis.custom.silverCoin}`
    }));
});

module.exports = command;