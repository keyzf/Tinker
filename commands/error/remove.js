'use strict'

const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "remove",
    aliases: ["rem", "delete", "del", "clear"],
    category: "Bot",
    description: "Remove a particular error from the error entries",
    usage: "<error ID>"
});

command.setLimits({
    cooldown: 1,
    limited: true
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["admin.command.error.remove"],
    memberPermissions: ["command.error.remove"]
});

command.registerSubCommand(`${__dirname}/remove/all`);

command.setExecute(async (client, message, args, cmd) => {
    if (!args[0]) { return message.channel.send("Please provide an error code"); }
    let searchCireteria = { _id: args[0] }
    if (args[0] == "all") { searchCireteria = {} }

    client.data.errordb.remove(searchCireteria).then(function(found) {

        let e = {
            title: `Error Code ${args[0]}`
        }

        if (!found.length) {
            e.description = "No error with that code could be found."
        } else {
            e.description = "Error has been removed from the file."
        }

        message.channel.send(client.operations.generateEmbed.run({...e, colour: client.statics.colours.tinker}));

    });
});

module.exports = command;
