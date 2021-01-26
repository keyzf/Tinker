const cron = require("node-cron");

module.exports.start = (bot) => {

    module.exports.updateTask = cron.schedule('*/60 * * * * *', () => {
        bot.shardFunctions.get("update").run();
    }, {
        scheduled: false
    });
}