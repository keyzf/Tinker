const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "messageReactionRemoveAll"
});

event.setExecute((client, message) => {
    return;
});


module.exports = event;