const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildDelete"
});

event.setExecute(async (client, guild) => {
    await client.data.db.query(`delete from guilds where guildID='${guild.id}'`);
    client.logger.info(`Removed from ${guild.name}(${guild.id})`);
});


module.exports = event;