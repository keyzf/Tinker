const { bot } = require("../index");
const { db, Fields } = require("../lib/db");
const logger = require("../lib/logger")

module.exports.run = async(userID, guildID, infractionType, infractorID, channelID) => {
    return null;
    // IN DEV
    
    const infractionID = uuidv4();
    db.prepare(`
        INSERT INTO infractions(${Fields.InfractionFields.userID}, ${Fields.InfractionFields.infractionID}, ${Fields.InfractionFields.guildID}, ${Fields.InfractionFields.infractionType}, ${Fields.InfractionFields.infractionUserID}, , ${Fields.InfractionFields.infractionChannelID})
        VALUES('${userID}', '${infractionID}', '${guildID}', '${infractionType}', '${infractorID}', '${channelID}');
    `).run();
}

module.exports.help = {
    name: "generateInfraction"
}