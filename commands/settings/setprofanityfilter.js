const { MessageEmbed } = require("discord.js");
// const logger = require("../../lib/logger");
const { Guild } = require('../../lib/db.js');
const setResponses = require("../../res/setResponse")

module.exports.run = async (bot, message, args, dbguild) => {

    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('you do not have permissions to use this command!');

    var save;

    if (args.length) {
        var val = args[0].toLowerCase();
        if (val == "true" || val == "on") save = true
        else if (val == "false" || val == "off") save = false
        else return message.reply("please use either `true` / `on` or `false` / `off` to set the filter or leave blank to toggle it")
    } else {
        save = !dbguild.preferences.profanityFilter
    }

    await Guild.updateOne(
        { id: dbguild.id },
        {
            $set: {
                "preferences.profanityFilter": save
            }
        }
    );

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
