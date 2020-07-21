const { bot } = require('../index');
const { Guild } = require('../lib/db.js');
const logger = require("../lib/logger");

bot.on("guildDelete", async guild => {
    // TODO delete guild from db when leave
    bot.emit("updateActivity")
});