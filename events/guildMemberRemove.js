const { bot } = require('../index');
const config = require("../config/config.json");
const logger = require("../lib/logger")

module.exports.run = async (member) => {
    bot.cevents.get("removeUser").run(member);
    // TODO user leave message
}

module.exports.help = {
    name: "guildMemberRemove"
}