const { bot } = require('../index');
const config = require("../config/config.json");
const logger = require("../lib/logger")

bot.on("updateActivity", async(text) => {
    //bot.user.setActivity(`with ${bot.users.cache.size} users on ${bot.guilds.cache.size} servers - [${config.prefix}]`);
    if (text) {
        return bot.user.setActivity(text, {
            type: "PLAYING"
        });
    }
    bot.user.setStatus('online')
    bot.user.setActivity(`with ${bot.users.cache.size} users on ${bot.guilds.cache.size} servers - [${config.prefix}]`, {
        type: "PLAYING"
    });
});