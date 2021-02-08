const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "channelUpdate"
});

event.setExecute((client, oldChannel, newChannel) => {
    return;
});


module.exports = event;