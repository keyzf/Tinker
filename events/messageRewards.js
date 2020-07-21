const { bot } = require('../index');
const logger = require("../lib/logger");
const { db, Fields } = require("../lib/db");

bot.on("messageReward", async(message, dbGuild) => {
    var val = Math.round(message.content.length / 5);
    const user = db.prepare(`Select * FROM users WHERE ${Fields.UserFields.guildID}='${dbGuild.guildID}' AND ${Fields.UserFields.userID}=${message.author.id}`).get();
    if (!user) return bot.emit("addUser", message.author.id, dbGuild)
    user.messagesSent += 1;
    user.devPoints += val;

    db.prepare(`
        UPDATE users
        SET ${Fields.UserFields.messagesSent}='${user.messagesSent}', ${Fields.UserFields.devPoints}='${user.devPoints}'
        WHERE ${Fields.GuildFields.guildID}='${dbGuild.guildID}' AND ${Fields.UserFields.userID}='${user.userID}';
    `).run()

});