'use strict'

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
    botPermissions: [],
    globalUserPermissions: ["user.command.config.description.none"],
    memberPermissions: ["command.config.description.none"]
});


cmd.setExecute(async(client, message, args, cmd) => {
    await client.data.db.query(`update guilds set description='' where guildID='${message.guild.id}'`);
    message.channel.send(client.operations.generateEmbed.run({
        description: "Description removed",
        colour: client.statics.colours.tinker
    }));
});

module.exports = cmd;