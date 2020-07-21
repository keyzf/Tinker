const Discord = require("discord.js");
const config = require('../../config/config.json');
const setResponses = require("../../res/setResponse");
const { db, Fields } = require("../../lib/db")

module.exports.run = async(bot, message, args, dbGuild) => {
    if (!message.member.hasPermission('MUTE_MEMBERS')) return message.reply('you do not have permissions to use this command!');

    let target = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply('please specify a member to mute!');
    let logs = message.guild.channels.cache.find(channel => channel.name == config.logsChannel)

    const guild = bot.guilds.cache.get(dbGuild.guildID);
    let id = db.prepare(`SELECT ${Fields.GuildFields.muteRoleID} from guilds WHERE ${Fields.GuildFields.guildID}=${dbGuild.guildID}`).get().muteRoleID
    await guild.roles.fetch();
    let muteRole = await guild.roles.cache.get(id);

    try {
        target.roles.remove(muteRole);
    } catch (err) {
        return message.channel.send(setResponses.haveIGotCorrectPerms())
    }
    await target.send(`You have been unmuted in ${message.guild.name} by ${message.author.tag}`);
    message.channel.send(`${target.user.username} was unmuted by ${message.author}`);

    if (!logs) return message.reply(`please create a channel called ${config.logsChannel} to log the mutes!`);

    let embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.user.avatarURL)
        .addField('Unmuted Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Unmuted By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Unmuted Time', message.createdAt)
        .setFooter('Unmuted user information', target.user.displayAvatarURL);
    logs.send(embed);
};

module.exports.help = {
    name: 'unmute',
    aliases: [],
    description: "Allows moderators to unmute users in the server",
    usage: "[@ user]",
    cooldown: 2
};