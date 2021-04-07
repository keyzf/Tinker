const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "heartbeat"
});

op.setExecute(async (client, count) => {
    const [{lastHeartbeat}] = await client.data.db.query(`select lastHeartbeat from bot where env='${process.env.NODE_ENV}'`)
    await client.data.db.query(`update bot set lastHeartbeat=? where env='${process.env.NODE_ENV}'`, [client.timeManager.timeToSqlDateTime(Date.now())]);
    client.logger.debug("[HEARTBEAT] Set");

    const [{totalUptime}] = await client.data.db.query(`select totalUptime from bot where env='${process.env.NODE_ENV}'`)
    await client.data.db.query(`update bot set totalUptime=? where env='${process.env.NODE_ENV}'`, [totalUptime + (Date.now() - new Date(lastHeartbeat).getTime())])

    client.operations.checkAnnouncement.run();

    if (process.env.NODE_ENV === "production") {
        client.operations.checkDiscordIncidents.run();
        client.operations.updateActivity.run()
    }
});

module.exports = op;