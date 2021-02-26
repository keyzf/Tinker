const Operation = require(`../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "update"
});

op.setExecute(async(client) => {
    client.operations.checkAnnouncement.run();
    client.operations.checkDiscordIncidents.run();
});

module.exports = op;