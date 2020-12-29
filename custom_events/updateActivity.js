const { bot } = require('../index');

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
    bot.user.setActivity("with your guild", {
        type: "PLAYING"
    });
}



module.exports.help = {
    name: "updateActivity"
}