
module.exports.setup = () => {
    process.on('SIGINT', async() => {
        this.call();
    });
}

module.exports.call = () => {
    const { bot } = require("../index");

    try {
        const { db } = require("./db");
        let { totalUptime } = db.prepare(`SELECT totalUptime FROM bot`).get();
        db.prepare(`UPDATE bot SET totalUptime='${totalUptime + bot.uptime}'`).run();
        bot.destroy();
    } catch (err) { console.log(err); console.log("Error in startup, exiting as emergency with as little integration as possible"); }
    process.exit();
}