const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "addGlobalUser"
});

op.setExecute(async(client, userID) => {
    client.data.db.prepare(`
        INSERT INTO globalUser(userID)
        VALUES(?);
    `).run(userID)
});

module.exports = op;