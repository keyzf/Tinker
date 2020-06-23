const { bot } = require('../index');
const logger = require("../lib/logger");

bot.on("messageReward", async (message, dbGuild) => {
    var val = Math.round(message.content.length / 5);
    const user = dbGuild.users.find(user => user.id == message.author.id);
    if (!user) return bot.emit("addUser", message, dbGuild)
    user.messagesSent += 1;
    user.devPoints += val;
    dbGuild.markModified("users");
    await dbGuild.save();
});