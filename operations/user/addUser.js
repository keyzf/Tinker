const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "addUser"
});

op.setExecute(async(client, userID, guildID) => {
    client.data.db.prepare(`
        INSERT INTO users(userID, guildID)
        VALUES(?, ?);
    `).run(userID, guildID);
    
});

module.exports = op;