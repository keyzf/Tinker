const discord = require("discord.js");
const config = require('../../config/config.json');
const setResponses = require("../../res/setResponse");

module.exports.run = async (bot, message, args) => {

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    let reason = args.slice(1).join(' ');
    let logs = message.guild.channels.cache.find(channel => channel.name == config.reportsChannel)

    if (!message.member.hasPermission('KICK_MEMBERS')) return message.reply('you do not have permissions to use this command!');

    if (!target) return message.reply('please specify a member to kick!');
    if (!reason) return message.reply('please specify a reason for this kick!');

    const user = await bot.users.cache.get(target.id);
    await user.send(`You have been kicked from ${message.guild.name} by ${message.author.tag} for: ${reason}`);

    try{
        target.kick(reason);
    } catch (err){
        return message.channel.send(setResponses.haveIGotCorrectPerms("pdDc-lG9-YlZ"))
    }

    if (!logs) return message.reply(`please create a channel called ${config.logsChannel} to log the kicks!`);
    
    let embed = new discord.MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.user.avatarURL)
        .addField('Kicked Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Kicked By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Kicked Time', message.createdAt)
        .addField('Kicked At', message.channel)
        .addField('Kicked Reason', reason)
        .setFooter('Kicked user information', target.user.displayAvatarURL);

    message.channel.send(`${target.user.username} was kicked by ${message.author} for ${reason}`);
    
    logs.send(embed);

};

module.exports.help = {
    name: 'kick',
    aliases: [],
    description: "Allows moderators to kick users from the server",
    usage: "[reason]",
    cooldown: 2
};
