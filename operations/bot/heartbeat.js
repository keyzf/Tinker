const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "heartbeat"
});

op.setExecute(async(client, count) => {
    client.logger.debug("[HEARTBEAT] Set")
    client.data.db.prepare("UPDATE bot SET lastHeartbeat=?").run(Date.now())
});

module.exports = op;