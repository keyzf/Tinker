const Operation = require("../../structures/Operation");
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
    
    // client.user.setActivity("Inanis make some questionable code decisions", {
    //     type: "WATCHING"
    // });

    client.user.setActivity(`with ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} users`, {
        type: "PLAYING"
    });

    // client.user.setActivity(`the quick loading challenge`, {
    //     type: "COMPETING"
    // });

});

module.exports = op;