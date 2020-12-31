const logger = require("../../lib/logger");
const generateDefaultEmbed = require("../../util/generateDefaultEmbed");

module.exports.run = async(bot, message, args, dbGuild) => {
    try { count = parseInt(args[0]); } catch { count = 1 }

    await message.delete();
    try {
        await message.channel.bulkDelete(count);
        return message.channel.send(generateDefaultEmbed({title:`Deleted ${count} messages`})).then((m) => { m.delete({ timeout: 3000 }) });
    } catch (err) {
        logger.debug(err)
        return message.channel.send(generateDefaultEmbed({title:`Could not delete messages`, description: `: ${err}`})).then((m) => { m.delete({ timeout: 3000 }) });
    }
};

module.exports.help = {
    name: 'clear',
    aliases: ["clean", "purge"],
    description: "Allows moderators to clear up the chat a bit",
    usage: "[number]",
    cooldown: 1
};