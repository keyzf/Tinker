const logger = require("../../lib/logger");
const setResponses = require("../../res/setResponse");
const Discord = require("discord.js")

module.exports.run = async(bot, message, args) => {

    var webhooks = [];
    var guildhooks;

    const guilds = await bot.guilds.cache.array();
    for (const guild of guilds) {
        try {
            guildhooks = await guild.fetchWebhooks();
        } catch (err) {
            message.channel.send(`no webhook perms in server ${guild.name}`);
            continue
        }
        for (const _guild of guildhooks.array()) {
            webhooks.push(_guild);
        }
    }

    const hooks = webhooks.filter(webhook => webhook.owner.id === bot.user.id && webhook.name == 'DevsApp Updates');
    const embed = new Discord.MessageEmbed();
    embed.setColor('#a700bd')
    embed.setAuthor(`Announcement!`)
    embed.setTitle(`${args[0]}`)
    embed.setDescription(`${args[1]}`)
    embed.setThumbnail(bot.user.displayAvatarURL())
    embed.setTimestamp()
    embed.setFooter('See you around!');

    hooks.forEach((webhook) => {
        try {
            webhook.send("", {
                "username": "DevsApp Updates",
                "embeds": [embed]
            })
        } catch (err) {
            logger.log("error", err.stack)
            message.channel.send("an error occured")
        }
    });
    logger.log("warn", `${message.member.user.tag} sent update broadcast from server ${message.guild.id}\n\t${args[0] + " | " + args[1]}`);
    return message.channel.send(setResponses.sendSuccessful())
}

module.exports.help = {
    name: "broadcast",
    aliases: [],
    description: "Sends a bot broadcast to all servers with the bot in and the broadcast configured to true",
    usage: "[\"title\" \"message\"]",
    cooldown: 5,
    limit: true
}