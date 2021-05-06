'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildMemberSpeaking"
});

event.setExecute((client, member, speaking) => {
    return;
});


module.exports = event;