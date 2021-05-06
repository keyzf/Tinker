'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildIntegrationsUpdate"
});

event.setExecute((client, guild) => {
    return;
});


module.exports = event;