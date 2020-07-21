const { MessageEmbed } = require("discord.js");
// const logger = require("../../lib/logger");
const { db, Fields } = require('../../lib/db');
const setResponses = require("../../res/setResponse")

module.exports.run = async(bot, message, args, dbGuild) => {

    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('you do not have permissions to use this command!');

    let input;
    let save;

    if (args.length) input = args[0].toLowerCase();
    else input = !dbGuild.profanityFilter;

    if (input == "true" || input == "on" || input == "1") save = 1
    else if (input == "false" || input == "off" || input == "0") save = 0
    else return message.reply("please use either `true` / `on` or `false` / `off` to set the filter or leave blank to toggle it")

    db.prepare(`
        UPDATE guilds
        SET ${Fields.GuildFields.profanityFilter}='${save}'
        WHERE guildID='${dbGuild.guildID}';
    `).run()

    const e = new MessageEmbed();
    e.setTitle("Profanity Filter Set")
    e.setDescription(save ? "on" : "off")

    message.channel.send(e)
}

module.exports.help = {
    name: "setprofanityfilter",
    aliases: ["setproffilter"],
    description: "Toggles your profanity filter",
    usage: "[on/true off/false]",
    cooldown: 5
}