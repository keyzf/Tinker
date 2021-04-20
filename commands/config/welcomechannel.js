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
    userPermissions: ["MANAGE_GUILD"],
    botPermissions: [],
    globalUserPermissions: ["user.command.config.welcomechannel."],
    memberPermissions: ["command.config.welcomechannel."]
});

command.registerSubCommand(`${__dirname}/welcomechannel/none.js`);

command.setExecute(async (client, message, args, cmd) => {
    let channel = message.mentions.channels.first();
    if (!channel && args[0]) {
        channel = await client.channels.fetch(args[0]);
    }
    if (!channel) {
        const [{welcomeChannel}] = await client.data.db.query(`select welcomeChannel from guilds where guildID='${message.guild.id}'`);
        return message.channel.send(client.operations.generateEmbed.run({
            description: `Please provide a welcome channel to change it to
            ${welcomeChannel ? `The current welcome channel is <#${welcomeChannel}>` : "Welcome channel not currently active"}`,
            colour: client.statics.colours.tinker
        }));
    }

    await client.data.db.query(`update guilds set welcomeChannel='${channel.id}' where guildID='${message.guild.id}'`);
    return message.channel.send(client.operations.generateEmbed.run({
        description: `Welcome channel set to <#${channel.id}>`,
        colour: client.statics.colours.tinker
    }));
});

module.exports = command;