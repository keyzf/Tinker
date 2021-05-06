'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "messageDeleteBulk"
});

event.setExecute((client, messages) => {
    return;
});


module.exports = event;