const logger = require("../../lib/logger");
const generateDefaultEmbed = require("../../util/generateDefaultEmbed");

module.exports.run = async(bot, message, args, dbGuild) => {
    try {
        delete require.cache[require.resolve('../../data/botInfo.json')]
        var { botInfo } = require("../../data/botInfo.json");
    } catch (e) {
        logger.error(e, { channel: message.channel });
        return await message.channel.send(await bot.shardFunctions.get("generateError").run(e, "Failed to get Bot Info"));
    }
    message.channel.send(generateDefaultEmbed({
        title: "Bot Information",
        description: "I'm going to tell you all about myself",
        fields: botInfo
    }));
};

module.exports.help = {
    name: 'botinfo',
    aliases: [],
    description: "Sends information about the bot",
    cooldown: 5,
    generated: true
};