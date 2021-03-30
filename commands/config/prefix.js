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
    botPermissions: []
});


command.setExecute(async (client, message, args, cmd) => {
    if (!args[0]) {
        const {prefix} = await client.data.db.getOne({
            table: "guilds",
            fields: ["prefix"],
            conditions: [`guildID='${message.guild.id}'`]
        });
        return message.channel.send(client.operations.generateEmbed.run({
            description: `Please provide a prefix to change it to
            The current prefix is \`${prefix}\``,
            colour: client.statics.colours.tinker
        }));
    }
    await client.data.db.set({
        table: "guilds",
        field_data: {prefix: args[0]},
        conditions: [`guildID='${message.guild.id}'`]
    });
    return message.channel.send(client.operations.generateEmbed.run({
        description: `Prefix set to \`${args[0]}\``,
        colour: client.statics.colours.tinker
    }));
});

module.exports = command;