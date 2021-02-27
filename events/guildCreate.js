const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildCreate"
});

event.setExecute((client, guild) => {
    client.data.db.prepare(`
        INSERT INTO guilds(guildID, prefix)
        VALUES(?, ?);
    `).run(guild.id, client.config.config.defaultPrefix);

    guild.fetchAuditLogs({ type: "BOT_ADD", limit: 1 }).then((log) => { // Fetching 1 entry from the AuditLogs for BOT_ADD.
        log.entries.first().executor.send(client.operations.generateEmbed.run({
            description: `Thank you for adding me to ${guild.name}!
                You can start setting up with \`tk!config\`
                If you need any help just run \`tk!help\` or contact us through our support server \`tk!invite\``,
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", log.entries.first().executor, "")
        })).catch(e => client.logger.warn(e));
    });
});


module.exports = event;