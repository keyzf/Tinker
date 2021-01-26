const { botOverlord } = require("../config/config.json")

// guild members custom status or online/offline status changes
module.exports.run = function(bot, oldMember, newMember) {
    // copies my presence
    // if (newMember.userID == botOverlord) {
    //     let text;
    //     if (newMember.activities.length) text = newMember.activities[0].state
    //     bot.shardFunctions.get("updateActivity").run(text);
    // }
}

module.exports.help = {
    name: "presenceUpdate"
}