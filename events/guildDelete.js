const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildDelete"
});

event.setExecute(async (client, guild) => {
    await client.data.db.delete({table: "guilds", conditions: [`guildID='${guild.id}'`]})

    client.logger.info(`Removed from ${guild.name}(${guild.id})`);
});


module.exports = event;