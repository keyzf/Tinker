const setResponses = require("../../res/setResponse");
const { officialServerId } = require("../../config/config.json");
const logger = require("../../lib/logger")

module.exports.run = async (bot, message, args) => {

    // return message.channel.send(setResponses.inDev())

    const content = args.join(" ")

    var webhooks = [];

    const guild = bot.guilds.cache.get(officialServerId)
    var guildhooks = await guild.fetchWebhooks();
    for (const _guild of guildhooks.array()) {
        webhooks.push(_guild);
    }

    const hooks = webhooks.filter(webhook => webhook.name == 'DevsApp Bug Reports');

    hooks.forEach((webhook) => {
        try {
            webhook.send(`${message.member.user.tag} sent a bug report from ${message.guild.name}:${message.guild.id}`, {
                "username": "DevsApp Bug Reports",
                "embeds": [
                    {
                        color: "#ff00ff",
                        description: content
                    }
                ]
            })
            logger.log("warn", `${message.member.user.tag} sent bug report from server ${message.guild.id}\n\t${content}`);
            return message.channel.send(setResponses.sendSuccessful())
        } catch (err) {
            logger.log("error", err.stack)
            return message.channel.send(setResponses.couldNotSend("p-rrh-tkL-Jsd"))
        }
    });


};

module.exports.help = {
    name: 'reportbug',
    aliases: [],
    description: "Allows you to report a bug directly to our support server (we much prefer that you come and see us, it allows us to understand the issue much better) [Official Support Server](https://discord.gg/aymBcRP)",
    usage: "[as much detail as possible and bug recreation instructions]",
    cooldown: 5
};