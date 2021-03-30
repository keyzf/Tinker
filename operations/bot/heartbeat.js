const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "update"
});

op.setExecute(async (client, count) => {
    const {lastHeartbeat: prevHeartbeat} = await client.data.db.getOne({table: "bot", fields: ["lastHeartbeat"]});
    await client.data.db.set({table: "bot", field_data: {lastHeartbeat: Date.now()}});
    client.logger.debug("[HEARTBEAT] Set");

    const {totalUptime} = await client.data.db.getOne({table: "bot", fields: ["totalUptime"]});
    await client.data.db.set({table: "bot", field_data: {totalUptime: totalUptime + (Date.now() - prevHeartbeat)}});

    client.operations.checkAnnouncement.run();

    if (process.env.NODE_ENV === "production") {
        client.operations.checkDiscordIncidents.run();
        client.operations.updateActivity.run()
    }
});

module.exports = op;