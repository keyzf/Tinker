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
    botPermissions: []
});

command.registerSubCommand(`${__dirname}/description/none.js`);

command.setExecute(async (client, message, args, cmd) => {
    if (!args || !args.length) {
        const {description} = await client.data.db.getOne({
            table: "guilds",
            fields: ["description"],
            conditions: [`guildID='${message.guild.id}'`]
        })
        return message.channel.send(client.operations.generateEmbed.run({
            description: `Please provide a description to change it to
            ${description ? `The current description is \`${description}\`` : "Description not currently set"}`,
            colour: client.statics.colours.tinker
        }));
    }

    await client.data.db.set({
        table: "guilds",
        field_data: {
            description: args.join(" ")
        },
        conditions: [`guildID='${message.guild.id}'`]
    });
    return message.channel.send(client.operations.generateEmbed.run({
        description: `Description set to \`${args.join(" ")}\``,
        colour: client.statics.colours.tinker
    }));
});

module.exports = command;