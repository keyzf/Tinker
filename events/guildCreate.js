const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildCreate"
});

const { v4: uuid } = require("uuid");

event.setExecute((client, guild) => {
    client.data.db.prepare(`
        INSERT INTO guilds(guildID, prefix, name)
        VALUES('${guild.id}', '${client.config.config.defaultPrefix}', ?);
    `).run(guild.name);
});


module.exports = event;