const logger = require("../../lib/logger");

module.exports.run = async (bot, message, args) => {

    logger.log("warn", `${message.member.user.tag} shutdown the bot from server ${message.guild.id}`)
    await message.channel.send('Shutting down bot');
    bot.shardFunctions.get("cleanExit").run();
    process.exit();

};

module.exports.help = {
    name: "shutdown",
    aliases: ["stop"],
    description: "Ends the bots life",
    usage: "",
    cooldown: 10,
    limit: true
};
