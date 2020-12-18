const Discord = require("discord.js");
const config = require('../../config/config.json');
const setResponses = require("../../data/setResponse");
const { arrEndJoin } = require("../../lib/utilFunctions");

module.exports.run = async(bot, message, args, dbGuild) => {

    if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply('you do not have permissions to use this command!');

    let target = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply('please specify a member to ban!');

    let reason = arrEndJoin(args, " ", 1) || "No reason specified";
    let logs = message.guild.channels.cache.get(dbGuild.logsChannel);

    bot.cevents.get("generateInfraction").run(target.user.id, message.guild.id, "BAN", reason, message.author.id, message.channel.id)
    await target.send(`You have been banned from ${message.guild.name} by ${message.author.tag} for: ${reason}`);
    try {
        target.ban(reason);
    } catch (err) {
        return message.channel.send(setResponses.haveIGotCorrectPerms("pdDc-lG9-YlZ"))
    }
    message.channel.send(`${target.user.username} was banned by ${message.author} for ${reason}`);

    if (!logs) return message.reply(`please set a logging channel to log the bans`);
    let embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.user.avatarURL)
        .addField('Banned Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Banned By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Banned Time', message.createdAt)
        .addField('Banned At', message.channel)
        .addField('Banned Reason', reason)
        .setFooter('Banned user information', target.user.displayAvatarURL);
    logs.send(embed);
};

module.exports.help = {
    name: 'ban',
    aliases: [],
    description: "Allows moderators to ban users from the server",
    usage: "[user] \"[reason]\"",
    cooldown: 0
};