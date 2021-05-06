'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "emojiCreate"
});

event.setExecute((client, emoji) => {
    return;
});


module.exports = event;