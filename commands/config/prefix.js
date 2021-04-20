const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "prefix",
    aliases: [],
    category: "Config",
    description: "Change the bot prefix",
    usage: ""
});

command.setLimits({
    cooldown: 3,
    limited: false
});

command.setPerms({
    userPermissions: ["MANAGE_GUILD"],
    botPermissions: [],
    globalUserPermissions: ["user.command.config.prefix"],
    memberPermissions: ["command.config.prefix"]
});


command.setExecute(async (client, message, args, cmd) => {
    if (!args[0]) {
        const [{prefix}] = await client.data.db.query(`select prefix from guilds where guildID='${message.guild.id}'`);
        return message.channel.send(client.operations.generateEmbed.run({
            description: `Please provide a prefix to change it to
            The current prefix is \`${prefix}\``,
            colour: client.statics.colours.tinker
        }));
    }
    await client.data.db.query(`update guilds set prefix=? where guildID='${message.guild.id}'`, [args[0]]);
    return message.channel.send(client.operations.generateEmbed.run({
        description: `Prefix set to \`${args[0]}\``,
        colour: client.statics.colours.tinker
    }));
});

module.exports = command;