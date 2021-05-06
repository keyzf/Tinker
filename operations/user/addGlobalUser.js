'use strict';

const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "addGlobalUser"
});

op.setExecute(async (client, userID) => {
    await client.data.db.query(`insert into globalUser(userId, dateJoined, perms) values(?, ?, ?)`, [userID, client.timeManager.timeToSqlDateTime(new Date()), "user.*"])
});

module.exports = op;