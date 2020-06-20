const logger = require("../../lib/logger");
const setResponses = require("../../res/setResponse")

module.exports.run = async (bot, message, args) => {

    const content = args.join(" ")

    var webhooks = [];
    var guildhooks;

    const guilds = await bot.guilds.cache.array();
    for (const guild of guilds) {
        try {
            guildhooks = await guild.fetchWebhooks();
        } catch(err) {
            message.channel.send(`no webhook perms in server ${guild.name}`);
            continue
        }
        for (const _guild of guildhooks.array()) {
            webhooks.push(_guild);
        }
    }

    const hooks = webhooks.filter(webhook => webhook.owner.id === bot.user.id && webhook.name == 'DevsApp Updates');
    hooks.forEach((webhook) => {
        try {
            webhook.send("", {
                "username": "DevsApp Updates",
                "embeds": [
                    {
                        color: "#ff00ff",
                        description: content
                    }
                ]
            })
        } catch (err) {
            logger.log("error", err.stack)
            message.channel.send("an error occured")
        }
    });
    logger.log("warn", `${message.member.user.tag} sent update broadcast from server ${message.guild.id}\n\t${content}`);
    return message.channel.send(setResponses.sendSuccessful())
}

module.exports.help = {
    name: "broadcastupdate",
    aliases: [],
    description: "Sends a bot status update to all servers with the bot in",
    usage: "[message]",
    cooldown: 5,
    limit: true
}