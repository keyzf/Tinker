const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "addUser"
});

op.setExecute(async(client, userID, dbGuild) => {
    client.data.db.prepare(`
        INSERT INTO users(userID, guildID)
        VALUES(?, ?);
    `).run(userID, dbGuild.guildID);
    
});

module.exports = op;