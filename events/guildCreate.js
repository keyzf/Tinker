const { bot } = require('../index');
const { db, Fields } = require("../lib/db");
const config = require("../config/config.json")

bot.on("guildCreate", async (guild) => {
    // this bot is made for one server so if it ever gets added to another guild... just leave it
    // until later when we might allow other people to add it
    if (guild.id != config.officialServerId) guild.leave();
    return;
    db.prepare(`
        INSERT INTO guilds(${Fields.GuildFields.guildID}, ${Fields.GuildFields.prefix}, ${Fields.GuildFields.name})
        VALUES('${guild.id}', '${config.prefix}', '${guild.name}');
    `).run()
});