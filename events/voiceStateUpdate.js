'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "voiceStateUpdate"
});

event.setExecute((client, voiceStateUpdate) => {
    return;
});


module.exports = event;