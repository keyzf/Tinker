'use strict';

const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "addUser"
});

op.setExecute(async(client, userID, guildID) => {
    await client.data.db.query(`insert into users(userId, guildId, perms) values(${userID}, ${guildID}, ?)`, ["command.*"]);
});

module.exports = op;