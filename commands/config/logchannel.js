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
    userPermissions: [],
    botPermissions: []
});

command.registerSubCommand(`${__dirname}/logchannel/none.js`);

command.setExecute(async(client, message, args, cmd) => {
    let channel = message.mentions.channels.first();
    if(!channel && args[0]) {
        channel = await client.channels.fetch(args[0]);
    }
    if (!channel) {
        const { logsChannel } = client.data.db.prepare("SELECT logsChannel FROM guilds where guildID=?").get(message.guild.id);
        return message.channel.send(client.operations.generateDefaultEmbed.run({
            description: `Please provide a log channel to change it to
            ${logsChannel ? `The current log channel is <#${logsChannel}>` : "Log channel not currently active" }`
        }));
    }

    client.data.db.prepare("UPDATE guilds SET logsChannel=? WHERE guildID=?").run(channel.id, message.guild.id);
    return message.channel.send(client.operations.generateDefaultEmbed.run({
        description: `Log channel set to <#${channel.id}>`
    }));
});

module.exports = command;