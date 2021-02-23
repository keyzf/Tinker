const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildCreate"
});

event.setExecute((client, guild) => {
    client.data.db.prepare(`
        INSERT INTO guilds(guildID, prefix, name)
        VALUES('${guild.id}', '${client.config.config.defaultPrefix}', ?);
    `).run(guild.name);
    guild.fetchAuditLogs({ type: "BOT_ADD", limit: 1 }).then((log) => { // Fetching 1 entry from the AuditLogs for BOT_ADD.
        log.entries.first().executor.send(`Thank you for adding me to ${guild.name}!
        You can start setting up with \`tk!config\`
        If you need any help just run \`tk!help\` or contact us through our support server \`tk!invite\``).catch(e => client.logger.error(e));
    });
});


module.exports = event;