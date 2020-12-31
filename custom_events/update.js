const { bot } = require("../index");
const logger = require("../lib/logger");

module.exports.run = () => {
    logger.debug("update");
    bot.cevents.get("checkEvents").run();
    bot.cevents.get("checkAnnouncements").run();
}

module.exports.help = {
    name: "update"
}