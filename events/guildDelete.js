const { bot } = require('../index');
const { db, Fields } = require('../lib/db.js');
const logger = require("../lib/logger");

module.exports.run = async(guild) => {
    db.prepare(`
        DELETE FROM guilds
        WHERE ${Fields.GuildFields.guildID} = '${guild.id}';
    `).run();
}

module.exports.help = {
    name: "guildDelete"
}