const { bot } = require('../index');
const { db, Fields } = require("../lib/db")
const logger = require("../lib/logger");
const config = require("../config/config.json")

bot.on("guildCreate", async (guild) => {
    db.prepare(`
        INSERT INTO guilds(${Fields.GuildFields.guildID}, ${Fields.GuildFields.prefix}, ${Fields.GuildFields.name})
        VALUES('${guild.id}', '${config.prefix}', '${guild.name}');
    `).run()
    bot.emit("updateActivity")
});