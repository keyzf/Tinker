'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildBanRemove"
});

event.setExecute((client) => {
    return;
});


module.exports = event;