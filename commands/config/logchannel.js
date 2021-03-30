const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "logchannel",
    aliases: [],
    category: "Config",
    description: "Change the log channel",
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

command.registerSubCommand(`${__dirname}/logchannel/none.js`);

command.setExecute(async (client, message, args, cmd) => {
    let channel = message.mentions.channels.first();
    if (!channel && args[0]) {
        channel = await client.channels.fetch(args[0]);
    }
    if (!channel) {
        const {logsChannel} = await client.data.db.getOne({
            table: "guilds",
            fields: ["logsChannel"],
            conditions: [`guildID='${message.guild.id}'`]
        });
        return message.channel.send(client.operations.generateEmbed.run({
            description: `Please provide a log channel to change it to
            ${logsChannel ? `The current log channel is <#${logsChannel}>` : "Log channel not currently active"}`,
            colour: client.statics.colours.tinker
        }));
    }

    await client.data.db.set({
        table: "guilds",
        field_data: {
            logsChannel: channel.id
        },
        conditions: [`guildID='${message.guild.id}'`]
    });
    return message.channel.send(client.operations.generateEmbed.run({
        description: `Log channel set to <#${channel.id}>`,
        colour: client.statics.colours.tinker
    }));
});

module.exports = command;