const { bot } = require('../index');
const logger = require("../lib/logger");

bot.on("addUser", async (message, dbGuild) => {
    dbGuild.users.push({
        id: message.author.id,
        messagesSent: 0,
        infractions: 0,
        devPoints: 0,
        level: 0
    });
    dbGuild.markModified("users");
    await dbGuild.save();
});