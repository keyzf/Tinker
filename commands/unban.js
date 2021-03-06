'use strict'

const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "unban",
    aliases: [],
    category: "Moderation",
    description: "Unban a user",
    usage: "<userID>"
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: ["BAN_MEMBERS"],
    botPermissions: ["MANAGE_MESSAGES"],
    globalUserPermissions: ["user.command.moderation.unban"],
    memberPermissions: ["command.moderation.unban"]
});

const {MessageEmbed} = require("discord.js");

command.setExecute(async (client, message, args, cmd) => {
    let target;
    try {
        if (!args[0]) throw Error()
        target = message.guild.member(message.mentions.users.first())
        if (!target) {
            target = await message.guild.members.fetch(args[0]);
        };
    } catch {}
    if (!target) { return message.reply('please specify a member to unban!') };
    if (target.user.bot) { return message.channel.send("You cannot perform moderation actions on bots") }
    if (target.id === message.author.id) { return message.channel.send("You cannot unban yourself"); }

    const [{logsChannel}] = await client.data.db.query(`select logsChannel from guilds where guildID='${message.guild.id}'`);
    let logs = logsChannel ? await client.channels.fetch(logsChannel) : null;

    try {
        await message.guild.members.unban(target);
    } catch ({stack}) {
        client.logger.error(stack, { channel: message.channel, content: message.content })
        const e = await client.operations.generateError.run(stack, "Failed to unban user", { channel: message.channel, content: message.content });
        message.channel.send(e);
        return;
    }

    await target.send(`You have been unbanned from ${message.guild.name} by ${message.author.tag}`);
    message.channel.send(`${target.username} was unbanned by ${message.author}`);

    if (!logs) return message.reply(`please set a logging channel to log the unbans`).then((msg) => client.operations.deleteCatch.run(msg, 5000));

    let embed = new MessageEmbed()
        .setColor("#00FF00")
        .setThumbnail(target.displayAvatarURL())
        .addField('Unbanned Member', `${target.username} with an ID: ${target.id}`)
        .addField('Unbanned By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Unbanned Time', message.createdAt.toLocaleString())
        .setFooter('Unbanned user information', target.displayAvatarURL());
    logs.send(embed);
});

module.exports = command;