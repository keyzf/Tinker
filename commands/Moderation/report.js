const discord = require('discord.js');
const config = require('../../config/config.json');

module.exports.run = async (bot, message, args) => {

    let target = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    let reason = args[1];
    let reports = message.guild.channels.cache.find(channel => channel.name == config.reportsChannel)

    if (!target) return message.reply('please specify a member to report!');
    if (!reason) return message.reply('please specify a reason for this report!');
    if (!reports) return message.reply(`please create a channel called ${config.reportsChannel} to log the reports!`);

    let embed = new discord.MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.user.avatarURL)
        .addField('Reported Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Reported By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Reported Time', message.createdAt)
        .addField('Reported In', message.channel)
        .addField('Reported Reason', reason)
        .setFooter('Reported user imformation', target.user.displayAvatarURL);

    message.channel.send(`${target} was reported by ${message.author} for ${reason}`).then((msg) => {
        msg.delete({timeout: 5000} );
        message.delete({timeout: 5000});
    });
    reports.send(embed);
};

module.exports.help = {
    name: 'report',
    aliases: [],
    description: "Allows users to report other users in the server",
    usage: "[@ user] \"[reason]\"",
    cooldown: 2
};