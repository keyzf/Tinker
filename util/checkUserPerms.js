const { GuildMember } = require("discord.js");
const { devs } = require("../config/devs")

module.exports.isDev = (id) => {
    return devs.includes(id)
}

/**
 * 
 * @param {GuildMember} member Discord Guild Member
 * @returns {Boolean} true: passes check, false: fails check
 */
module.exports.sendMessages = (member) => {
    // if (this.isDev(member.id)) return true;
}