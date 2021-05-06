'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "inviteDelete"
});

event.setExecute((client, invite) => {
    return;
});


module.exports = event;