const cron = require("node-cron")
const { bot } = require("../index")

module.exports.start = () => {

    module.exports.updateTask = cron.schedule('*/60 * * * * *', () => {
        bot.cevents.get("update").run();
    }, {
        scheduled: false
    });
}