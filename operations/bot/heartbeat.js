const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "heartbeat"
});

op.setExecute(async (client, count) => {
    await client.data.db.query(`update bot set lastHeartbeat=? where env='${process.env.NODE_ENV}'`, [client.timeManager.timeToSqlDateTime(Date.now())]);
    client.logger.debug("[HEARTBEAT] Set");

    client.operations.checkAnnouncement.run();

    if (process.env.NODE_ENV === "production") {
        client.operations.checkDiscordIncidents.run();
        client.operations.updateActivity.run()
    }
});

module.exports = op;