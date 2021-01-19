module.exports.run = (bot, message, args, dbGuild, cmd) => {
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!channel) {
        return message.channel.send(`You did not mention / give the id of your channel!`);
    }
}

module.exports.help = {
    name: "advancedpoll",
    aliases: ["apoll", "spoll", "smartpoll"],
    description: "Create an advanced poll",
    usage: "",
    cooldown: 5,
    inDev: true,
    generated: true
}