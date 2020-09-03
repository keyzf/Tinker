const eventManager = require("./eventManager")
const gameloop = require("node-gameloop");

module.exports.start = () => {
    let frameCount = 0;
    const id = gameloop.setGameLoop(function(delta) {
        if (frameCount !== 0) { eventManager.update(); }
        frameCount++
    }, 30 * 1000); // 1 tick every 30s
}