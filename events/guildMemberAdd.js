const { bot } = require('../index');
const config = require("../config/config.json");
const logger = require("../lib/logger");
const { db, Fields} = require("../lib/db")

bot.on("guildMemberAdd", async (member) => {
    const dbGuild = db.prepare(`SELECT * FROM guilds WHERE ${Fields.GuildFields.guildID}='${member.guild.id}'`).get()
    bot.emit("addUser", member.id, dbGuild);
    // TODO user joined message
});