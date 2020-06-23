const Discord = require("discord.js")
const moment = require("moment")

module.exports.run = async (bot, message, args, dbGuild) => {

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(message.author.id));
    let dbTarget = dbGuild.users.find((user) => user.id == target.id)
    if (!target) return message.reply('please specify a user!');

    let embed = new Discord.MessageEmbed()
        .setAuthor(`Requested by ${message.author.username}`)
        .setDescription(`${target.user.username}#${target.user.discriminator}`, target.user.displayAvatarURL())
        .setColor(`RANDOM`)
        .setThumbnail(`${target.user.displayAvatarURL()}`)
        .addField('Joined at:', `${moment.utc(target.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
        .addField('Created at:', `${moment.utc(target.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
        .addField('Status:', target.presence.status, true)
        // sets up to three fields in one line so there would be a break here
        .addField('Messages Sent:', dbTarget.messagesSent, true)
        .addField('Dev Points:', dbTarget.devPoints, true)
        .addField('Level:', dbTarget.level, true)
        .addField('Infractions:', dbTarget.infractions)
        .addField('Roles:', target.roles.cache.map(r => `${r}`).join(' | '))
        .setFooter(`ID: ${target.id}`)
        .setTimestamp();

    message.channel.send({ embed: embed });
    return;
};

module.exports.help = {
    name: 'userstats',
    aliases: ["user", "who", "userinfo"],
    description: "See stats about yourself or other users",
    usage: "[@ user]",
    cooldown: 5
};