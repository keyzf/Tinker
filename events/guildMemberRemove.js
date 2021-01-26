const config = require("../config/config.json");
const logger = require("../lib/logger")

module.exports.run = async (bot, member) => {
    bot.shardFunctions.get("removeUser").run(member);
    // TODO user leave message
}

module.exports.help = {
    name: "guildMemberRemove"
}