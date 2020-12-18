const { Message } = require("discord.js")
const logger = require("../lib/logger")

/**
 * 
 * @param {Message} msg 
 * @param {Number} timeout in ms
 * 
 * @returns {Boolean} true if the message was deleted successfully, false if not
 */
async function deleteCatch(msg, timeout) {
    try {
        await msg.delete({timeout: timeout || 0});
        return true;
    } catch (e) {
        logger.debug(e);
        return false;
    }
}
module.exports = deleteCatch;
