const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "addUser"
});

op.setExecute(async(client, userID, guildID) => {
    await client.data.db.insert({
        table: "users",
        field_data: {
            userID: userID,
            guildID: guildID
        }
    });
    
});

module.exports = op;