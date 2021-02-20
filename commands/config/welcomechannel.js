const Command = require(`../../structures/Command`);
const command = new Command();

command.setInfo({
    name: "welcomechannel",
    aliases: [],
    category: "Config",
    description: "Change the welcome channel",
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

command.registerSubCommand(`${__dirname}/welcomechannel/none.js`);

command.setExecute(async(client, message, args, cmd) => {
    let channel = message.mentions.channels.first();
    if(!channel && args[0]) {
        channel = await client.channels.fetch(args[0]);
    }
    if (!channel) {
        const { welcomeChannel } = client.data.db.prepare("SELECT welcomeChannel FROM guilds where guildID=?").get(message.guild.id);
        return message.channel.send(client.operations.get("generateDefaultEmbed")({
            description: `Please provide a welcome channel to change it to
            ${welcomeChannel ? `The current welcome channel is <#${welcomeChannel}>` : "Welcome channel not currently active" }`
        }));
    }

    client.data.db.prepare("UPDATE guilds SET welcomeChannel=? WHERE guildID=?").run(channel.id, message.guild.id);
    return message.channel.send(client.operations.get("generateDefaultEmbed")({
        description: `Welcome channel set to <#${channel.id}>`
    }));
});

module.exports = command;