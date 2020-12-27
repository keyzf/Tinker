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
    // bot.user.setActivity(`with ${bot.users.cache.size} users over ${bot.guilds.cache.size} guilds - [${config.prefix}]`, {
    //     type: "PLAYING"
    // });
    bot.user.setActivity("with your guid", {
        type: "PLAYING"
    });
}



module.exports.help = {
    name: "updateActivity"
}