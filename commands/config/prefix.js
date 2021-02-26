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


command.setExecute(async(client, message, args, cmd) => {
    if (!args[0]) {
        const { prefix } = client.data.db.prepare("SELECT prefix FROM guilds where guildID=?").get(message.guild.id);
        return message.channel.send(client.operations.generateDefaultEmbed.run({
            description: `Please provide a prefix to change it to
            The current prefix is ${prefix}`
        }));
    }
    client.data.db.prepare("UPDATE guilds SET prefix=? WHERE guildID=?").run(args[0], message.guild.id);
    return message.channel.send(client.operations.generateDefaultEmbed.run({
        description: `Prefix set to \`${args[0]}\``
    }));
});

module.exports = command;