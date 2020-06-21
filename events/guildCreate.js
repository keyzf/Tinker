const { bot } = require('../bot');
const { Guild } = require('../lib/db.js');
const { create_UUID } = require("../lib/utilFunctions.js");
const logger = require("../lib/logger");
const config = require("../config/config.json")

bot.on("guildCreate", async guild => {
    const docs = await Guild.find({
        id: guild.id
    });
    if (!docs.length) {
        const doc = new Guild({
            name: guild.name,
            id: guild.id,
            dashId: `${create_UUID()}`,
            preferences: {
                description: "None set",
                profanityFilter: true
            }
        })
        await doc.save()
        logger.log("info", `Added to ${guild.name}:${guild.id}`)
        bot.user.setActivity(`around on ${bot.guilds.cache.size} servers - [${config.prefix}]`);
    }

});