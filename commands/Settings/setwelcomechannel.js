const { MessageEmbed } = require("discord.js");
const { db, Fields } = require('../../lib/db');

module.exports.run = async(bot, message, args, dbGuild) => {

    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('you do not have permissions to use this command!');

    let channel;
    if (args[0]) { 
        channel = bot.channels.cache.get(args[0].match(/\<\#(?<channelId>[0-9]+)\>/).groups.channelId); } else { channel = message.channel;
    }

    db.prepare(`
        UPDATE guilds
        SET ${Fields.GuildFields.welcomeChannel}='${channel.id}'
        WHERE guildID='${dbGuild.guildID}';
    `).run()

    const e = new MessageEmbed();
    e.setTitle("Welcome channel set")
    e.setDescription(`<#${channel.id}>`)

    message.channel.send(e)
}

module.exports.help = {
    name: "setwelcomechanne;",
    aliases: ["welcomechannel"],
    description: "Set the welcome channel for user join events",
    usage: "[channel mention]",
    cooldown: 5,
}