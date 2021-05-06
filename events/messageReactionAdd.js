'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "messageReactionAdd"
});

event.setExecute((client, messageReaction, user) => {
    return;
});


module.exports = event;