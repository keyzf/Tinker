const gameloop = require("node-gameloop");
const { bot } = require("../index")

module.exports.start = () => {
    let frameCount = 0;
    const id = gameloop.setGameLoop(function(delta) {
        if (frameCount !== 0) { bot.cevents.get("update").run(); }
        frameCount++
    }, 60 * 1000); // 1 tick every 30s
}