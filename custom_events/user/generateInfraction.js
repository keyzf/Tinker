const { bot } = require("../../index");
const { db, Fields } = require("../../lib/db");
const logger = require("../../lib/logger");
const { v4: uuidv4 } = require("uuid")

module.exports.run = async(userID, guildID, infractionType, infractionReason, infractorID, channelID) => {

    const infractionID = uuidv4();
    db.prepare(`
        INSERT INTO infractions(${Fields.InfractionFields.userID}, ${Fields.InfractionFields.id}, ${Fields.InfractionFields.guildID}, ${Fields.InfractionFields.type}, ${Fields.InfractionFields.reason}, ${Fields.InfractionFields.infractorUserId}, ${Fields.InfractionFields.channelID})
        VALUES(?, ?, ?, ?, ?, ?, ?);
    `).run(userID, infractionID, guildID, infractionType, infractionReason, infractorID, channelID);

    const infractedUser = db.prepare(`SELECT * FROM users WHERE ${Fields.GuildFields.guildID}='${guildID}' AND ${Fields.UserFields.userID}='${userID}'`).get();
    
    if (!infractedUser.infractions) infractedUser.infractions = []
    else infractedUser.infractions = infractedUser.infractions.split(",")

    infractedUser.infractions.push(infractionID);
    infractedUser.infractions = infractedUser.infractions.join(",");

    db.prepare(`
        UPDATE users
        SET ${Fields.UserFields.infractions}='${infractedUser.infractions}'
        WHERE ${Fields.GuildFields.guildID}='${infractedUser.guildID}' AND ${Fields.UserFields.userID}='${infractedUser.userID}';
    `).run()
}

module.exports.help = {
    name: "generateInfraction"
}