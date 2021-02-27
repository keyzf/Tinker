const Command = require(`../../../structures/Command`);
const cmd = new Command();

cmd.setInfo({
    name: "none",
    aliases: ["off", "disable"],
    category: "Config",
    description: "Disable the welcome channel",
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
    client.data.db.prepare("UPDATE guilds SET welcomeChannel=? WHERE guildID=?").run(null, message.guild.id);
    message.channel.send(client.operations.generateEmbed.run({
        description: "Welcome Channel disabled",
        colour: client.statics.colours.tinker
    }));
});

module.exports = cmd;