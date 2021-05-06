'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "presenceUpdate"
});

event.setExecute((client, oldMember, newMember) => {
    return;
});


module.exports = event;