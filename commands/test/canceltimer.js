const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "canceltimer",
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
    client.timeManager.deleteTimer(args[0]);

});

module.exports = command;