// unban all
// message.guild.fetchBans().then(bans => {
//     bans.forEach(user => {
//         console.log(user.username + '#' + user.tag);
//         user.send('MESSAGE / INVITE LINK');
//         message.guild.unban(user);
//     });
// });

const Discord = require("discord.js");
const config = require('../../config/config.json');
const setResponses = require("../../data/setResponse");
const logger = require("../../lib/logger")

module.exports.run = async(bot, message, args, dbGuild) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply('you do not have permissions to use this command!');

    let target = bot.users.cache.get(args[0]);
    if (!target) return message.reply('please specify a valid member to unban!');

    let logs = message.guild.channels.cache.get(dbGuild.logsChannel);

    try {
        message.guild.members.unban(target);
    } catch (err) {
        logger.error(err)
        return message.channel.send(setResponses.haveIGotCorrectPerms("pdDc-lG9-YlZ"))
    }

    await target.send(`You have been unbanned from ${message.guild.name} by ${message.author.tag}`);
    message.channel.send(`${target.username} was unbanned by ${message.author}`);

    if (!logs) return message.reply(`please set a logging channel to log the unbans`);

    let embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.avatarURL)
        .addField('Unbanned Member', `${target.username} with an ID: ${target.id}`)
        .addField('Unbanned By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Unbanned Time', message.createdAt)
        .setFooter('Unbanned user information', target.displayAvatarURL);
    logs.send(embed);
};

module.exports.help = {
    name: 'unban',
    aliases: [],
    description: "Allows moderators to unban users from the server",
    usage: "[userID]",
    cooldown: 0
};