const { bot } = require('../index');
const logger = require("../lib/logger");
const { db, Fields } = require("../lib/db")

module.exports.run = async(userID, dbGuild) => {
    db.prepare(`
        INSERT INTO users(${Fields.UserFields.userID}, ${Fields.UserFields.guildID})
        VALUES(?, ?);
    `).run(userID, dbGuild.guildID)
    bot.cevents.get("updateActivity").run()
}


module.exports.help = {
    name: "addUser"
}