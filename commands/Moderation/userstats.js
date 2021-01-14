const Discord = require("discord.js");
const moment = require("moment");
const { db, Fields } = require("../../lib/db")

module.exports.run = async(bot, message, args, dbGuild) => {

    let target = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(message.author.id);
    // message.channel.send(`target user is ${target.user.username}`);
    if (!target) return message.reply('please specify a user!');
    let dbTarget = db.prepare(`SELECT * FROM users WHERE ${Fields.UserFields.guildID}='${dbGuild.guildID}' AND ${Fields.UserFields.userID}=${target.id}`).get();
    // message.channel.send(`target userID is ${dbTarget.userID} from guild ${dbGuild.guildID}`);
    if (!dbTarget) return message.reply('could not find user!');

    let embed = new Discord.MessageEmbed()
        .setAuthor(`Requested by ${message.author.username}`)
        .setDescription(`${target.user.username}#${target.user.discriminator}`, target.user.displayAvatarURL())
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
    cooldown: 5,
    generated: true
};

