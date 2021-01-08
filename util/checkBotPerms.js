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
    if (!pass) {
        if (message) {
            return generateDefaultEmbed({
                title: "Perms check failed",
                description: "I failed my permissions check for Managing Messages! I need this to delete spam / inappropriate messages and pinning messages",
                fields: [
                    { name: "Solutions", value: "Make sure I have permissions to manage messages in all channels. If you are unsure, give me the administrator permission, it allows me to do everything I need" }
                ]
            });
        }
        return false
    }
    return true
}

/**
 * 
 * @param {Guild} guild Discord Guild Object
 * @param {Boolean} message true to return a suitable embed to notify user
 * @returns {(MessageEmbed | Boolean)} returns bool when message true, true: permission cleared false: permission denied, returns suitable embed message to alert user
 */
module.exports.addReactions = (guild, message) => {
    const pass = guild.me.hasPermission("ADD_REACTIONS");
    if (!pass) {
        if (message) {
            return generateDefaultEmbed({
                title: "Perms check failed",
                description: "I failed my permissions check for Adding Reactions! I need this to put reactions on message for my tunes and polls",
                fields: [
                    { name: "Solutions", value: "Make sure I have permissions to add reactions in all channels. If you are unsure, give me the administrator permission, it allows me to do everything I need" }
                ]
            });
        }
        return false
    }
    return true
}

/**
 * 
 * @param {Guild} guild Discord Guild Object
 * @param {Boolean} message true to return a suitable embed to notify user
 * @returns {(MessageEmbed | Boolean)} returns bool when message true, true: permission cleared false: permission denied, returns suitable embed message to alert user
 */
module.exports.attachFiles = (guild, message) => {
    const pass = guild.me.hasPermission("ATTACH_FILES");
    if (!pass) {
        if (message) {
            return generateDefaultEmbed({
                title: "Perms check failed",
                description: "I failed my permissions check for attaching files! I kinda want that one so I can make everything pretty!",
                fields: [
                    { name: "Solutions", value: "Make sure I have permissions to attach files in all channels. If you are unsure, give me the administrator permission, it allows me to do everything I need" }
                ]
            });
        }
        return false
    }
    return true
}

/**
 * 
 * @param {Guild} guild Discord Guild Object
 * @param {Boolean} message true to return a suitable embed to notify user
 * @returns {(MessageEmbed | Boolean)} returns bool when message true, true: permission cleared false: permission denied, returns suitable embed message to alert user
 */
module.exports.embedLinks = (guild, message) => {
    const pass = guild.me.hasPermission("EMBED_LINKS");
    if (!pass) {
        if (message) {
            return generateDefaultEmbed({
                title: "Perms check failed",
                description: "I failed my permissions check for putting links into my messages! I need this one so you can get to my support server or others can add me to their server!",
                fields: [
                    { name: "Solutions", value: "Make sure I have permissions to embed links in all channels. If you are unsure, give me the administrator permission, it allows me to do everything I need" }
                ]
            });
        }
        return false
    }
    return true
}

/**
 * 
 * @param {Guild} guild Discord Guild Object
 * @param {Boolean} message true to return a suitable embed to notify user
 * @returns {(MessageEmbed | Boolean)} returns bool when message true, true: permission cleared false: permission denied, returns suitable embed message to alert user
 */
module.exports.addReactions = (guild, message) => {
    const pass = guild.me.hasPermission("MANAGE_WEBHOOKS");
    if (!pass) {
        if (message) {
            return generateDefaultEmbed({
                title: "Perms check failed",
                description: "I failed my permissions check for managing webhooks! I really this to send announcements and events!",
                fields: [
                    { name: "Solutions", value: "Make sure I have permissions to manage webhooks in all channels. If you are unsure, give me the administrator permission, it allows me to do everything I need" }
                ]
            });
        }
        return false
    }
    return true
}