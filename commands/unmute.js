const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "unmute",
    aliases: [],
    category: "Moderation",
    description: "Unmute a member",
    usage: "<@ user / userID>"
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: ["MUTE_MEMBERS"],
    botPermissions: ["MANAGE_MESSAGES", "MUTE_MEMBERS", "MANAGE_ROLES"],
    globalUserPermissions: ["user.command.moderation.unmute"],
    memberPermissions: ["command.moderation.unmute"]
});

const { MessageEmbed } = require("discord.js");

command.setExecute(async(client, message, args, cmd) => {
    let target;
    try {
        if (!args[0]) throw Error()
        target = message.guild.member(message.mentions.users.first())
        if (!target) {
            target = await message.guild.members.fetch(args[0]);
        };
    } catch {}
    if (!target) { return message.reply('please specify a member to unmute!') };
    if (target.user.bot) { return message.channel.send("You cannot perform moderation actions on bots") }
    if (target.id === message.author.id) { return message.channel.send("You cannot unmute yourself"); }

    const [{ logsChannel, muteRoleID }] = await client.data.db.query(`select logsChannel, muteRoleID from guilds where guildID='${message.guild.id}'`);
    let logs = logsChannel ? await client.channels.fetch(logsChannel) : null;

    let muteRole = muteRoleID ? await message.guild.roles.fetch(muteRoleID) : null;

    if (!muteRole) {
        client.logger.debug(`Failed to get muteRole for ${message.guild.id}`);
        const e = await client.operations.generateError.run(stack, "Failed to find role by that ID, please update your mute role using the config command", { channel: message.channel, content: message.content });
        message.channel.send(e);
        return;
    }

    try {
        await target.roles.remove(muteRole);
    } catch ({ stack }) {
        client.logger.error(stack, { channel: message.channel, content: message.content })
        const e = await client.operations.generateError.run(stack, "Failed to revoke the mute", { channel: message.channel, content: message.content });
        message.channel.send(e);
        return;
    }
    await target.send(`You have been unmuted in ${message.guild.name} by ${message.author.tag}`);
    message.channel.send(`${target.user.username} was unmuted by ${message.author}`);

    if (!logs) return message.channel.send(`Please set a logging channel to log the unmutes`).then((msg) => client.operations.deleteCatch.run(msg, 5000));

    let embed = new MessageEmbed()
        .setColor('#00FF00')
        .setThumbnail(target.user.displayAvatarURL())
        .addField('Unmuted Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Unmuted By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Unmuted Time', message.createdAt)
        .setFooter('Unmuted user information', target.user.displayAvatarURL());
    logs.send(embed);
});

module.exports = command;