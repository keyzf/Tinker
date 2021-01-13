const { bot } = require('../index');
const { db, Fields } = require("../lib/db");
const config = require("../config/config.json");
const { v4: uuid } = require("uuid")

module.exports.run = async(guild) => {
    db.prepare(`
        INSERT INTO guilds(${Fields.GuildFields.guildID}, ${Fields.GuildFields.prefix}, ${Fields.GuildFields.name}, ${Fields.GuildFields.dashboardID})
        VALUES('${guild.id}', '${config.prefix}', '${guild.name}', '${uuid()}');
    `).run();
    bot.cevents.get("updateActivity").run();
}

module.exports.help = {
    name: "guildCreate"
}