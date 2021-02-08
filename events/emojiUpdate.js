const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "emojiUpdate"
});

event.setExecute((client, oldEmoji, newEmoji) => {
    return;
});


module.exports = event;