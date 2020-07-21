const { bot } = require('../index');
const config = require("../config/config.json");
const logger = require("../lib/logger")

bot.on("guildMemberRemove", async () => {
    bot.emit("removeUser");
    // TODO user leave message
});