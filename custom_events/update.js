const { bot } = require("../index");
const { db, Fields } = require("../lib/db");
const logger = require("../lib/logger");
const Discord = require("discord.js")

module.exports.run = async() => {
    logger.debug("update");
    await bot.event.checkEvents();
    await bot.event.checkAnnouncements();
}

module.exports.help = {
    name: "update"
}