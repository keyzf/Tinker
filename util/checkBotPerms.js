const { Guild, MessageEmbed } = require("discord.js");
const generateDefaultEmbed = require("./generateDefaultEmbed");

/**
 * 
 * @param {Guild} guild Discord Guild Object
 * @param {Boolean} message true to return a suitable embed to notify user
 * @returns {(MessageEmbed | Boolean)} returns bool when message true, true: permission cleared false: permission denied, returns suitable embed message to alert user
 */
module.exports.manageMessages = (guild, message) => {
    const pass = guild.me.hasPermission("MANAGE_MESSAGES");

    return generateDefaultEmbed({
        title: "Perms check failed",
        description: "I failed my permissions check for Managing Messages! I really need that one!",
        fields: [
            {name:"Solutions", value:"Make sure I have permissions to manage messages in all channels. If you are unsure, give me the administrator permission, it allows me to do everything I need" }
        ]
    });
}

/**
 * 
 * @param {Guild} guild Discord Guild Object
 * @param {Boolean} message true to return a suitable embed to notify user
 * @returns {(MessageEmbed | Boolean)} returns bool when message true, true: permission cleared false: permission denied, returns suitable embed message to alert user
 */
module.exports.addReactions = (guild, message) => {
    if (!message) { return guild.me.hasPermission("ADD_REACTIONS"); }
}