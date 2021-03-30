const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "update"
});

op.setExecute(async(client, count) => {
    client.operations.heartbeat.run();

    client.operations.checkAnnouncement.run();

    if (process.env.NODE_ENV == "production") {
        client.operations.checkDiscordIncidents.run();
        client.operations.updateActivity.run()
    }
});

module.exports = op;