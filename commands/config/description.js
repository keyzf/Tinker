const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "description",
    aliases: [],
    category: "Config",
    description: "Change the description of the server",
    usage: ""
});

command.setLimits({
    cooldown: 3,
    limited: false
});

command.setPerms({
    userPermissions: ["MANAGE_GUILD"],
    botPermissions: [],
    globalUserPermissions: ["user.command.config.description"],
    memberPermissions: ["command.config.description"]
});

command.registerSubCommand(`${__dirname}/description/none.js`);

command.setExecute(async (client, message, args, cmd) => {
    if (!args || !args.length) {
        const [{description}] = await await client.data.db.query(`select description from guilds where guildID='${message.guild.id}'`);
        return message.channel.send(client.operations.generateEmbed.run({
            description: `Please provide a description to change it to
            ${description ? `The current description is \`${description}\`` : "Description not currently set"}`,
            colour: client.statics.colours.tinker
        }));
    }

    await client.data.db.query(`update guilds set description=? where guildID='${message.guild.id}'`, [args.join(" ")]);
    return message.channel.send(client.operations.generateEmbed.run({
        description: `Description set to \`${args.join(" ")}\``,
        colour: client.statics.colours.tinker
    }));
});

module.exports = command;