const Operation = require("../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "updateActivity"
});

op.setExecute(async(client, text) => {
    if (text) {
        return client.user.setActivity(text, {
            type: "PLAYING"
        });
    }
    client.user.setStatus('online')
    
    client.user.setActivity("Inanis make some questionable code decisions", {
        type: "WATCHING"
    });

    // client.user.setActivity("with your guild", {
    //     type: "PLAYING"
    // });

    // bot.user.setActivity(`with ${bot.users.cache.size} users over ${bot.guilds.cache.size} guilds - [${config.prefix}]`, {
    //     type: "PLAYING"
    // });
});

module.exports = op;