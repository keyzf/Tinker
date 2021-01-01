const logger = require("./logger");

module.exports.setup = () => {
    process.on('SIGINT', async () => {
        await this.call();
    });
}

module.exports.call = async () => {
    const { bot } = require("../index");
    try {
        require("../lib/updateLoop").updateTask.destroy()
        const { db } = require("./db");
        let { totalUptime } = db.prepare(`SELECT totalUptime FROM bot`).get();
        db.prepare(`UPDATE bot SET totalUptime='${totalUptime + bot.uptime}'`).run();
        await bot.destroy();
    } catch (err) { console.log(err); console.log("Error in startup, exiting as emergency with as little integration as possible"); }
    process.exit();
}