const { bot } = require('../index');
const config = require("../config/config.json");
const logger = require("../lib/logger")

bot.on("removeUser", async () => {
    // TODO remove user from db
});