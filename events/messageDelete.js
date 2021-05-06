'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "messageDelete"
});

event.setExecute((client, message) => {
    return;
});


module.exports = event;