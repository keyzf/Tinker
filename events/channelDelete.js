const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "channelDelete"
});

event.setExecute((client, channel) => {
    return;
});


module.exports = event;