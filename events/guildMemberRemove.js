'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildMemberRemove"
});

event.setExecute((client, member) => {
    return;
});


module.exports = event;