const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildDelete"
});

event.setExecute((client, guid) => {
    db.prepare(`
        DELETE FROM guilds
        WHERE guildID = '${guild.id}';
    `).run();
});


module.exports = event;