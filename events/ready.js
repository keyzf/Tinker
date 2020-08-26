const { bot } = require('../index');
const logger = require("../lib/logger");
const { db, Fields } = require("../lib/db");

bot.on("ready", async () => {

    logger.log("info", `${bot.user.username} is online! Setup still running`);
    bot.emit("updateActivity");

    logger.debug("Checking for invalid guilds");
    const guilds = db.prepare(`SELECT ${Fields.GuildFields.guildID} FROM guilds`).all();
    guilds.forEach((guild) => {
        if (!bot.guilds.cache.has(guild.guildID)) {
            db.prepare(`DELETE FROM guilds WHERE ${Fields.GuildFields.guildID}='${guild.guildID}'`);
            logger.warn(`Invalid guildID '${guild.guildID}' found in the database - Removed`);
        }
    });

    // tell pm2 or another connected sevice that the bot is online and ready
    process.send('ready');
    logger.info(`${bot.user.username} setup complete and functional`);
});