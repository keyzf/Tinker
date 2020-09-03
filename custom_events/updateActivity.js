const { bot } = require('../index');
const config = require("../config/config.json");
const logger = require("../lib/logger")

module.exports.run = async(text) => {
    if (text) {
        return bot.user.setActivity(text, {
            type: "PLAYING"
        });
    }
    bot.user.setStatus('online')
    bot.user.setActivity(`with ${bot.users.cache.size} users - [${config.prefix}]`, {
        type: "PLAYING"
    });
}



module.exports.help = {
    name: "updateActivity"
}