const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "generateInfraction"
});


const {v4: uuidv4} = require("uuid")

op.setExecute(async (client, userID, guildID, infractionType, infractionReason, infractorID, channelID) => {
    const infractionID = uuidv4();
    await client.data.db.query(`insert into 
    infractions(infractionUserID, infractionID, infractionGuildID, infractionType, infractionReason, infractorUserId, infractionChannelID) 
    values(?, ?, ?, ?, ?, ?, ?)`, [userID, infractionID, guildID, infractionType, infractionReason, infractorID, channelID])

    const [infractedUser] = await client.data.db.query(`select * from users where userId='${userID}' and guildId='${guildID}'`);

    if (!infractedUser.infractions) infractedUser.infractions = []
    else infractedUser.infractions = infractedUser.infractions.split(",")

    infractedUser.infractions.push(infractionID);
    infractedUser.infractions = infractedUser.infractions.join(",");

    await client.data.db.set({
        table: "users",
        field_data: {infractions: infractedUser.infractions},
        conditions: [`guildID='${infractedUser.guildID}'`, `userID='${infractedUser.userID}'`]
    })

});

module.exports = op;