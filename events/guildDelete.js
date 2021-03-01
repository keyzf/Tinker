const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildDelete"
});

event.setExecute((client, guild) => {
    client.data.db.prepare(`
        DELETE FROM guilds
        WHERE guildID = '${guild.id}';
    `).run();

    client.logger.info(`Added to ${guild.name}(${guild.id})`);
});


module.exports = event;