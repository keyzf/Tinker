const Command = require(`../../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "all",
    aliases: [],
    category: "Bot",
    description: "Remove all entries from error log",
    usage: ""
});

command.setLimits({
    cooldown: 2,
    limited: true
});

command.setPerms({
    userPermissions: [],
    botPermissions: []
});

command.setExecute(async (client, message, args, cmd) => {
    client.data.errordb.remove({}).then(function(found) {
        message.channel.send(client.operations.get("generateDefaultEmbed")({
            title: "All errors deleted"
        }));
    });
});

module.exports = command;