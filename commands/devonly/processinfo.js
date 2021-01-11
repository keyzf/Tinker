const pm2 = require('pm2');
const logger = require("../../lib/logger");
const util = require("util")

module.exports.run = async(bot, message, args, dbGuild, cmd) => {
    pm2.describe('tinker', (err, data) => {
        if (err) {
            logger.error(err);
        }
        logger.debug(util.inspect(data, {showHidden: false, depth: null}));
    })
};

module.exports.help = {
    name: 'processinfo',
    aliases: [],
    description: "Get process information",
    usage: "",
    cooldown: 5,
    limit: true
};