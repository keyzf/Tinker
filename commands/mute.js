const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "mute",
    aliases: [],
    category: "Moderation",
    description: "Mute a member",
    usage: "<@ user> <reason>"
});

command.setLimits({
    cooldown: 1,
    limited: false
});

command.setPerms({
    userPermissions: ["MUTE_MEMBERS"],
    botPermissions: ["MANAGE_MESSAGES", "MUTE_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS"]
});

const { MessageEmbed } = require("discord.js");

command.setExecute(async(client, message, args, cmd) => {
    let target = message.guild.member(message.mentions.users.first() || await message.guild.members.fetch(args[0]));
    if (!target) return message.reply('please specify a member to mute!');
    if (target.id === message.author.id) { return message.channel.send("You cannot mute yourself"); }

    let reason = client.utility.arrEndJoin(args, " ", 1) || "No reason specified";

    const [{logsChannel}] = await client.data.db.query(`select logsChannel from guilds where guildID='${message.guild.id}'`);
    let logs = logsChannel ? await client.channels.fetch(logsChannel) : null;

    let muteRole = await client.operations.updateMuteRole.run(message.guild.id, null, message.channel);

    try {
        target.roles.add(muteRole);
    } catch ({stack}) {
        client.logger.error(stack, { channel: message.channel, content: message.content, origin: __filename })
        const e = await client.operations.generateError.run(stack, "Failed to apply the mute", { channel: message.channel, content: message.content, origin: __filename });
        message.channel.send(e);
        return;
    }

    client.operations.generateInfraction.run(target.user.id, message.guild.id, "MUTE", reason, message.author.id, message.channel.id)

    await target.send(`You have been muted in ${message.guild.name} by ${message.author.tag} for: ${reason}`);
    message.channel.send(`${target.user.username} was muted by ${message.author} for ${reason}`);

    if (!logs) return message.channel.send(`Please set a logging channel to log the mutes`).then((msg) => client.operations.deleteCatch.run(msg, 5000));
    let embed = new MessageEmbed()
        .setColor('#ff0000')
        .setThumbnail(target.user.displayAvatarURL())
        .addField('Muted Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Muted By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Muted Time', message.createdAt.toLocaleString())
        .addField('Muted At', message.channel)
        .addField('Muted Reason', reason)
        .setFooter('Muted user information', target.user.displayAvatarURL());
    logs.send(embed);
});

module.exports = command;