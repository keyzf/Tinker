const discord = require('discord.js');
const config = require('../../config/config.json');
const { arrEndJoin } = require("../../lib/utilFunctions");

module.exports.run = async (bot, message, args, dbGuild) => {

    let target = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    let reason = arrEndJoin(args, " ", 1) || "No reason specified";
    let logs = message.guild.channels.cache.get(dbGuild.logsChannel);

    if (!target) return message.reply('please specify a member to report!');
    if (!reason) return message.reply('please specify a reason for this report!');
    if (!logs) return message.reply(`please set a logging channel to log the reports`);

    let embed = new discord.MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.user.avatarURL)
        .addField('Reported Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Reported By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Reported Time', message.createdAt)
        .addField('Reported In', message.channel)
        .addField('Reported Reason', reason)
        .setFooter('Reported user information', target.user.displayAvatarURL);

    message.channel.send(`${target} was reported by ${message.author} for ${reason}`).then((msg) => {
        msg.delete({timeout: 5000} );
        message.delete({timeout: 5000});
    });
    logs.send(embed);
};

module.exports.help = {
    name: 'report',
    aliases: [],
    description: "Allows users to report other users in the server",
    usage: "[@ user] \"[reason]\"",
    cooldown: 2
};