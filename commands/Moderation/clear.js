const logger = require("../../lib/logger");

module.exports.run = async(bot, message, args, dbGuild) => {
    try { count = parseInt(args[0]); } catch { count = 2 }

    await message.delete();
    try {
        await message.channel.bulkDelete(count);
        return message.channel.send(`Deleted ${count} messages`).then((m) => { m.delete({ timeout: 5000 }) });
    } catch (err) {
        logger.debug(err)
        return message.channel.send(`Could not delete messages: ${err}`).then((m) => { m.delete({ timeout: 5000 }) });
    }
};

module.exports.help = {
    name: 'clear',
    aliases: ["clean", "purge"],
    description: "Allows moderators to clear up the chat a bit",
    usage: "[number]",
    cooldown: 0
};