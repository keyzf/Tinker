const Discord = require("discord.js");
const { arrEndJoin } = require("../../lib/utilFunctions");

module.exports.run = async(bot, message, args, dbGuild) => {

    if (!message.member.hasPermission('MUTE_MEMBERS')) return message.reply('you do not have permissions to use this command!');

    let target = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply('please specify a member to mute!');
    let reason = arrEndJoin(args, " ", 1) || "No reason specified";
    let logs = message.guild.channels.cache.get(dbGuild.logsChannel);

    let muteRole = await bot.shardFunctions.get("updateMuteRole").run(dbGuild)

    target.roles.add(muteRole);

    bot.shardFunctions.get("generateInfraction").run(target.user.id, message.guild.id, "MUTE", reason, message.author.id, message.channel.id)

    await target.send(`You have been muted in ${message.guild.name} by ${message.author.tag} for: ${reason}`);
    message.channel.send(`${target.user.username} was muted by ${message.author} for ${reason}`);

    if (!logs) return message.reply(`please set a logging channel to log the mutes`);
    let embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.user.avatarURL)
        .addField('Muted Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Muted By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Muted Time', message.createdAt)
        .addField('Muted At', message.channel)
        .addField('Muted Reason', reason)
        .setFooter('Muted user information', target.user.displayAvatarURL);
    logs.send(embed);
};

module.exports.help = {
    name: 'mute',
    aliases: [],
    description: "Allows moderators to mute users in the server",
    usage: "[@ user]  \"[reason]\"",
    cooldown: 2
};

