const gameloop = require("node-gameloop");
const { bot } = require("../index")

module.exports.start = () => {
    let updateCount = 0;
    const id = gameloop.setGameLoop(function(delta) {
        if (updateCount !== 0) { bot.cevents.get("update").run(); }
        updateCount++
    }, 60 * 1000); // 1 tick every 60s
}