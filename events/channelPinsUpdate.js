'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "channelPinsUpdate"
});

event.setExecute((client, channel, time) => {
    return;
});


module.exports = event;