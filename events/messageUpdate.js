const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "messageUpdate"
});

event.setExecute((client, oldMessage, newMessage) => {
    return;
});


module.exports = event;