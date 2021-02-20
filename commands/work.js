const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "work",
    aliases: [],
    category: "Currency",
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

function sameHour(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate() &&
        d1.getHours() === d2.getHours();
}

command.setExecute(async(client, message, args, cmd) => {
    const { lastWork } = client.data.db.prepare("SELECT lastWork FROM currency WHERE userID=?").get(message.author.id);
    if (sameHour(new Date(lastWork), new Date())) {
        return message.channel.send(client.operations.get("generateDefaultEmbed")({
            description: "You can't get back to work yet"
        }));
    }
    const val = client.utility.randomFromInterval(10, 30);
    client.data.db.prepare("UPDATE currency SET lastWork=?, currencyUnit0=? WHERE userID=?").run(Date.now(), val, message.author.id);
    return message.channel.send(client.operations.get("generateDefaultEmbed")({
        description: `You earned ${val} Copper Piece${val > 1 ? "s" : "" } ${client.data.emojis.custom.copperCoinStack}`
    }));
});

module.exports = command;