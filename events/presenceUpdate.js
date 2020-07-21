const { bot } = require('../index');
const logger = require("../lib/logger");
const setResponses = require("../res/setResponse")
const { botOverlord } = require("../config/config.json")

// guild members custom status or online/offline status changes
bot.on("presenceUpdate", function(oldMember, newMember) {
    if (newMember.userID == botOverlord) {
        let text;
        if (newMember.activities.length) text = newMember.activities[0].state
        bot.emit("updateActivity", text)
    }
});