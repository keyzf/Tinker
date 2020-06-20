const logger = require("../../lib/logger");
const setResponses = require("../../res/setResponse")

module.exports.run = async (bot, message, args, dbGuild) => {

    return message.channel.send(setResponses.inDev())

    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('you do not have permissions to use this command!');

    message.author.send(`The dashboard ID for ${dbGuild.name} is ${dbGuild.dashId}\nMake sere to keep this super safe! (if anyone else gets this ID they could edit your bot settings!)`)
    message.reply("I sent you a direct message! (Be sure to keep that value secret though. Anyone who gets hold of it can edit your bot preferences in the dashboard!)")

};

module.exports.help = {
    name: 'getdashboardid',
    aliases: ["getdashid", "dashid", "editorid", "geteditorid"],
    description: "Send you a private message with this servers dashboard ID. Alllows you to make changes to your bot settings from an simple, easy web dashboard",
    cooldown: 10
};