const Discord = require("discord.js");
const moment = require("moment");
const { db, Fields } = require("../../lib/db");

module.exports.run = async(bot, message, args, dbGuild) => {

    let target = await message.guild.members.fetch(message.mentions.users.first(), {withPresence: true}) || await message.guild.members.fetch(args[0], {withPresence: true}) || await message.guild.members.fetch(message.author.id, {withPresence: true});
    if (!target) return message.reply('please specify a user!');

    let dbTarget = db.prepare(`SELECT * FROM users WHERE ${Fields.UserFields.guildID}='${dbGuild.guildID}' AND ${Fields.UserFields.userID}=${target.id}`).get();
    if (!dbTarget) return message.reply('could not find user!');

    let embed = new Discord.MessageEmbed()
        .setDescription(`${target.user.username}#${target.user.discriminator} ID: ${target.id}`, target.user.displayAvatarURL())
        .setColor(`RANDOM`)
        .setThumbnail(`${target.user.displayAvatarURL()}`)
        .addField('Joined at:', `${moment.utc(target.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
        .addField('Created at:', `${moment.utc(target.user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
        .addField('Status:', target.presence.status, true)
        // sets up to three fields in one line so there would be a break here
        .addField('Messages Sent:', dbTarget.messagesSent, true)
        .addField('Scrap Value:', dbTarget.currencyUnits, true)
        .addField('Level:', dbTarget.level, true)
        .addField('Infractions:', (function() {
            if (!dbTarget.infractions) return 0
            else return dbTarget.infractions.split(",").length
        }()))
        .addField('Roles:', target.roles.cache.map(r => `${r}`).join(' | '))
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp();

    message.channel.send({ embed: embed });
    return;
};

module.exports.help = {
    name: 'userstats',
    aliases: ["user", "who", "userinfo"],
    description: "See stats about yourself or other users",
    usage: "[@ user]",
    cooldown: 5,
    generated: true
};

