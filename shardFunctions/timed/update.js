const logger = require("../../lib/logger");
const { apiLatency } = require("../../lib/pm2Metrics")


module.exports.run = (bot) => {
    logger.debug("update");

    apiLatency.update(bot.ws.ping);

    bot.shardFunctions.get("checkEvents").run();
    bot.shardFunctions.get("checkAnnouncements").run();
    bot.shardFunctions.get("checkPolls").run();
}

module.exports.help = {
    name: "update"
}