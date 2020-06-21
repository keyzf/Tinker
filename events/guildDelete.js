const { bot } = require('../index');
const { Guild } = require('../lib/db.js');
const logger = require("../lib/logger");

bot.on("guildDelete", async guild => {
    const docs = await Guild.find({ id: guild.id });
    if (docs.length) {
        Guild.deleteMany({ id: guild.id }, function (err) {
            if (err) return logger.log("error", err.stack);
            logger.log("info", `removed from guild ${guild.name}:${guild.id}`)
            bot.user.setActivity(`around on ${bot.guilds.cache.size} servers - [${config.prefix}]`);
        });
    }
});