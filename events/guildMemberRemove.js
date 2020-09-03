const { bot } = require('../index');
const config = require("../config/config.json");
const logger = require("../lib/logger")

bot.on("guildMemberRemove", async (member) => {
    bot.event.removeUser(member);
    // TODO user leave message
});