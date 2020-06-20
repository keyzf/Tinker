const setResponses = require("../../res/setResponse");
const { officialServerId } = require("../../config/config.json");
const logger = require("../../lib/logger");

module.exports.run = async (bot, message, args) => {

    // return message.channel.send(setResponses.inDev())

    const content = args.join(" ")

    var webhooks = [];

    const guild = bot.guilds.cache.get(officialServerId)
    var guildhooks = await guild.fetchWebhooks();
    for (const _guild of guildhooks.array()) {
        webhooks.push(_guild);
    }

    const hooks = webhooks.filter(webhook => webhook.name == 'DevsApp Feature Requests');

    hooks.forEach((webhook) => {
        try {
            webhook.send(`${message.member.user.tag} sent a feature request from ${message.guild.name}:${message.guild.id}`, {
                "username": "DevsApp Feature Requests",
                "embeds": [
                    {
                        color: "#ff00ff",
                        description: content
                    }
                ]
            })
            logger.log("warn", `${message.member.user.tag} sent feature request from server ${message.guild.id}\n\t${content}`);
            return message.channel.send(setResponses.sendSuccessful())
        } catch (err) {
            logger.log("error", err.stack)
            return message.channel.send(setResponses.couldNotSend("p-rrh-tkL-Jsd"))
        }
    });

};

module.exports.help = {
    name: 'requestfeature',
    aliases: [],
    description: "Allows you to request content directly to our offical support server (we much prefer that you come and see us, it allows us to understand the request much better) [Official Support Server](https://discord.gg/aymBcRP)",
    usage: "[as much detail as possible about the requested feature]",
    cooldown: 5
};