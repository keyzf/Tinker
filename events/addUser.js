const { bot } = require('../index');
const logger = require("../lib/logger");
const { db, Fields } = require("../lib/db")

bot.on("addUser", async(userID, dbGuild) => {
    db.prepare(`
        INSERT INTO users(${Fields.UserFields.userID}, ${Fields.UserFields.guildID})
        VALUES('${userID}', '${dbGuild.guildID}');
    `).run()
    bot.emit("updateActivity")
});
