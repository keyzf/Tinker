
module.exports.run = async (bot) => {
    try {
        bot.user.setStatus('offline')
        require("../lib/updateLoop").updateTask.destroy()
        // const { db } = require("../lib/db");
        // let { totalUptime } = db.prepare(`SELECT totalUptime FROM bot`).get();
        // db.prepare(`UPDATE bot SET totalUptime='${totalUptime + bot.uptime}'`).run();
        bot.destroy();
    } catch (err) { console.log(err); console.log("Error, exiting as emergency with as little integration as possible"); }
    // process.exit();
    return;
}

module.exports.help = {
    name: "cleanExit"
}