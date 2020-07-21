const { bot } = require('../index');
const config = require("../config/config.json");
const logger = require("../lib/logger")

bot.on("ready", async () => {

    logger.log("info", `${bot.user.username} is ready for action!`);
    bot.emit("updateActivity")

    // This creates a basic db entry of all the current servers the bot is added to
    // can be used in the event of a db wipe
    // !! uses nedb - the bot is now using sql !!
    //
    // await bot.guilds.cache.array().forEach(id => {
    //     main.find({
    //         guildID: id
    //     }, (err, docs) => {
    //         if (err) console.error(err);
    //         if (!docs.length) return
    //         guild = docs[0];

    //         main.insert({
    //             guildID: id,
    //             prefix: config.prefix
    //         });
    //     });
    // });

    // tell pm2 or another connected sevice that the bot is online and ready
    process.send('ready');
});