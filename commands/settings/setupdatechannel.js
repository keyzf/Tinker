module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("you do not have permission to use this command")

    const webhooks = await message.guild.fetchWebhooks();
    const hooks = webhooks.filter(webhook => webhook.owner.id === bot.user.id && webhook.name === 'DevsApp Updates');

    if (hooks.size != 0) {
        try {
            for (let [id, webhook] of hooks) await webhook.delete(`Requested by ${message.author.tag}`);
        } catch (err) {
            logger.log("error", err.stack)
            await message.channel.send('Something went wrong.')
        }
        await message.channel.send('Successfully deleted old DevsApp Updates webhook');
    }

    message.channel.createWebhook("DevsApp Updates", {
        avatar: bot.user.displayAvatarURL(),
    })
        .then(webhook => {
            webhook.send("", {
                "username": "DevsApp Updates",
                "embeds": [
                    {
                        color: "#ff00ff",
                        description: "All bot updates for devsapp will be sent here"
                    }
                ]
            })
                .catch((err) => {
                    logger.log("error", err.stack)
                    message.channel.send("an error occured")
                });
        })
}

module.exports.help = {
    name: "setupdatechannel",
    aliases: [],
    description: "Get updates on the bots status (like downtime and new features) by running this command in the channel you want the updates",
    usage: "",
    cooldown: 10
}
