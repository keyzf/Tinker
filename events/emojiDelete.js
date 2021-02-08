const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "emojiDelete"
});

event.setExecute((client, emoji) => {
    return;
});


module.exports = event;