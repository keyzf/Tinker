const { db, Fields } = require("../lib/db");
const config = require("../config/config.json");
const { v4: uuid } = require("uuid")

module.exports.run = async(bot, guild) => {
    db.prepare(`
        INSERT INTO guilds(${Fields.GuildFields.guildID}, ${Fields.GuildFields.prefix}, ${Fields.GuildFields.name}, ${Fields.GuildFields.dashboardID})
        VALUES('${guild.id}', '${config.prefix}', ?, '${uuid()}');
    `).run(guild.name);
    bot.shardFunctions.get("updateActivity").run();
}

module.exports.help = {
    name: "guildCreate"
}