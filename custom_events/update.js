const { bot } = require("../index");
const logger = require("../lib/logger");
const { apiLatency } = require("./pm2Metrics")


module.exports.run = () => {
    logger.debug("update");

    apiLatency.update(bot.ws.ping);

    bot.cevents.get("checkEvents").run();
    bot.cevents.get("checkAnnouncements").run();
}

module.exports.help = {
    name: "update"
}