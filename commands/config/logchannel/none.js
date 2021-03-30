const Command = require(`../../../structures/Command`);
const cmd = new Command();

cmd.setInfo({
    name: "none",
    aliases: ["off", "disable"],
    category: "Config",
    description: "Disable the log channel",
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


cmd.setExecute(async (client, message, args, cmd) => {
    await client.data.db.set({
        table: "guilds",
        field_data: {
            logsChannel: null
        },
        conditions: [`guildID='${message.guild.id}'`]
    });
    message.channel.send(client.operations.generateEmbed.run({
        description: "Log Channel disabled",
        colour: client.statics.colours.tinker
    }));
});

module.exports = cmd;