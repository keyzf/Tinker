const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "channelCreate"
});

event.setExecute((client, channel) => {
    return;
});


module.exports = event;