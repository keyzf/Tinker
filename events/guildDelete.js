const { bot } = require('../index');
const { Guild } = require('../lib/db.js');
const logger = require("../lib/logger");

bot.on("guildDelete", async guild => {
    logger.critical(`Bot was removed from guild: ${guild.name}, ${guild.id}`)
});