const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "generateInfraction"
});


const { v4: uuidv4 } = require("uuid")

op.setExecute(async(client, userID, guildID, infractionType, infractionReason, infractorID, channelID) => {
    const infractionID = uuidv4();
    client.data.db.prepare(`
        INSERT INTO infractions(infractionUserID, infractionID, infractionGuildID, infractionType, infractionReason, infractorUserId, infractionChannelID)
        VALUES(?, ?, ?, ?, ?, ?, ?);
    `).run(userID, infractionID, guildID, infractionType, infractionReason, infractorID, channelID);

    const infractedUser = client.data.db.prepare(`SELECT * FROM users WHERE guildID='${guildID}' AND userID='${userID}'`).get();
    
    if (!infractedUser.infractions) infractedUser.infractions = []
    else infractedUser.infractions = infractedUser.infractions.split(",")

    infractedUser.infractions.push(infractionID);
    infractedUser.infractions = infractedUser.infractions.join(",");

    client.data.db.prepare(`
        UPDATE users
        SET infractions='${infractedUser.infractions}'
        WHERE guildID='${infractedUser.guildID}' AND userID='${infractedUser.userID}';
    `).run()
});

module.exports = op;