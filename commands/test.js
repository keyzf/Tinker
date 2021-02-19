const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "test",
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


command.setExecute(async(client, message, args, cmd) => {
    // let json = { "channels": ["709034490579910730", "803585103049392149"] };

    // json["channels"].forEach(async(channel) => {
    //     let ch = await client.channels.fetch(channel)
    //     if (!ch) { return console.log("channel not found") }
    //     ch.send("proving a point to <@309392120811356170>")
    // })
});

module.exports = command;