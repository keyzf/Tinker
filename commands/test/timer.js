const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "timer",
    aliases: [],
    category: "DevOnly",
    description: "",
    usage: ""
});

command.setLimits({
    cooldown: 0,
    limited: true
});

command.setPerms({
    userPermissions: [],
    botPermissions: []
});

const ms = require("pretty-ms");

command.setExecute(async (client, message, args, cmd) => {
    const timer = client.timeoutManager.createTimer(1 * 60 * 1000);
    message.channel.send(timer.uid);
    timer.on("fire", (timeSince) => {
        message.channel.send(`Fired ${ms(timeSince)} after creation`);
    }).on("cancel", (timeSince) => {
        message.channel.send(`Cancelled ${ms(timeSince)} after creation`);
    });
});

module.exports = command;