const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "addCurrency"
});

op.setExecute(async(client, userID) => {
    client.data.db.prepare(`
        INSERT INTO currency(userID)
        VALUES(?);
    `).run(userID)
});

module.exports = op;