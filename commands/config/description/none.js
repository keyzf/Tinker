const Command = require(`../../../structures/Command`);
const cmd = new Command();

cmd.setInfo({
    name: "none",
    aliases: ["off", "disable"],
    category: "Config",
    description: "Disable the description",
    usage: ""
});

cmd.setLimits({
    cooldown: 3,
    limited: false
});

cmd.setPerms({
    userPermissions: ["MANAGE_GUILD"],
    botPermissions: []
});


cmd.setExecute(async(client, message, args, cmd) => {
    client.data.db.prepare("UPDATE guilds SET description=? WHERE guildID=?").run(null, message.guild.id);
    message.channel.send(client.operations.generateEmbed.run({
        description: "Description removed",
        colour: client.statics.colours.tinker
    }));
});

module.exports = cmd;