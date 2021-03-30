const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "addGlobalUser"
});

op.setExecute(async (client, userID) => {
    await client.data.db.insert({
        table: "globalUser",
        field_data: {
            userID: userID,
            dateJoined: client.timeManager.timeToSqlDateTime(new Date())
        }
    });
});

module.exports = op;