const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildCreate"
});

event.setExecute(async (client, guild) => {
    await client.data.db.insert({
        table: "guilds", field_data: {
            guildID: guild.id,
            prefix: client.config.config.defaultPrefix,
            dateJoined: client.timeManager.timeToSqlDateTime(new Date())
        }
    });
    await client.data.db.query(`insert into guilds(guildID, prefix, dateJoined) values(${guild.id}, ${client.config.config.defaultEmbed}, ${client.timeManager.timeToSqlDateTime(Date.now())})`);
    
    client.logger.info(`Added to ${guild.name}(${guild.id})`);

    // tell user how to get started
    guild.fetchAuditLogs({type: "BOT_ADD", limit: 1}).then((log) => { // Fetching 1 entry from the AuditLogs for BOT_ADD.
        if(log.target.id !== client.user.id){ return; }
        log.entries.first().executor.send(client.operations.generateEmbed.run({
            description: `Thank you for adding me to ${guild.name}!
                You can start setting up with \`tk!config\`
                If you need any help just run \`tk!help\` or contact us through our support server \`tk!invite\``,
            fields: [{
                name: "Permissions",
                value: (() => {
                    // check permissions
                    if (guild.me.permissions.bitfield !== 8) {
                        return `I was not added with administrator permissions, this means that I won't be able to do everything. If you know what you are doing please make sure I have adequate perms (read up on them by running \`tk!perms\`), if not then please kick and reinvite me with this link ${client.config.config.invite}`
                    }
                    return "Nice one, it looks like you have used the correct link and we are ready to start!"
                })()
            }],
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", log.entries.first().executor, "")
        })).catch(() => client.logger.debug("Cannot send message to executor"));
    }).catch(() => {
        client.logger.debug("Cannot fetch audit log");
    });

});


module.exports = event;