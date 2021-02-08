const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "typingStart"
});

event.setExecute((client, channel, user) => {
    return;
});


module.exports = event;