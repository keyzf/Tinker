const token = process.env.BOT_TOKEN;
const logger = require("../../lib/logger");

module.exports.run = async (bot, message, args) => {

    //return message.channel.send("My creator was stupid and thought this did something...\nIt doesn't lol")

    logger.log("warn", `${message.member.user.tag} reloaded the bot from server ${message.guild.id}`)
    await message.channel.send('Restarting bot');
    await bot.destroy()
    process.exit()

};

module.exports.help = {
    name: "reload",
    aliases: ["restart"],
    description: "Restarts the bot when in production and stops the bot when in development",
    usage: "",
    cooldown: 20,
    limit: true
};
