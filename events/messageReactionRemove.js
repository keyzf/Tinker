'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "messageReactionRemove"
});

event.setExecute((client, messageReaction, user) => {
    return;
});


module.exports = event;