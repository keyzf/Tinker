const { MessageEmbed } = require("discord.js");
// const logger = require("../../lib/logger");
const { db, Fields } = require('../../lib/db');
const setResponses = require("../../data/setResponse")

module.exports.run = async(bot, message, args, dbGuild) => {

    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('you do not have permissions to use this command!');

    let channel;
    if (args[0]) { 
        channel = bot.channels.cache.get(args[0].match(/\<\#(?<channelId>[0-9]+)\>/).groups.channelId); } else { channel = message.channel;
    }

    db.prepare(`
        UPDATE guilds
        SET ${Fields.GuildFields.logsChannel}='${channel.id}'
        WHERE guildID='${dbGuild.guildID}';
    `).run()

    const e = new MessageEmbed();
    e.setTitle("Logging channel set")
    e.setDescription(`<#${channel.id}>`)

    message.channel.send(e)
}

module.exports.help = {
    name: "setloggingchannel",
    aliases: ["setlogchannel", "logchannel"],
    description: "Set the logging channel for moderation events",
    usage: "[channel mention]",
    cooldown: 5,
}