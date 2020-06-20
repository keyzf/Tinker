const discord = require("discord.js");
const config = require('../../config/config.json');

module.exports.run = async (bot, message, args) => {

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    let reason = args.slice(1).join(' ');
    let logs = message.guild.channels.cache.find(channel => channel.name == config.reportsChannel)

    if (!message.member.hasPermission('MUTE_MEMBERS')) return message.reply('you do not have permissions to use this command!');

    if (!target) return message.reply('please specify a member to mute!');
    if (!reason) return message.reply('please specify a reason for this mute!');


    // TODO: mute command
    // TODO: unmute command
    // TODO: unban command
    // TODO: tempban command
    // TODO: temp mute command
    return message.reply("command in dev");


    const user = await bot.users.cache.get(target.id);
    await user.send(`You have been muted in ${message.guild.name} by ${message.author.tag} for: ${reason}`);
    

    if (!logs) return message.reply(`please create a channel called ${config.logsChannel} to log the kicks!`);
    
    let embed = new discord.MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.user.avatarURL)
        .addField('Muted Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Muted By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Muted Time', message.createdAt)
        .addField('Muted At', message.channel)
        .addField('Muted Reason', reason)
        .setFooter('Muted user information', target.user.displayAvatarURL);

    message.channel.send(`${target.user.username} was muted by ${message.author} for ${reason}`);
    
    logs.send(embed);

};

module.exports.help = {
    name: 'mute',
    aliases: [],
    description: "Allows moderators to mute users in the server",
    usage: "[reason]",
    cooldown: 2
};
