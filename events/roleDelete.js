const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "roleDelete"
});

event.setExecute((client) => {
    return;
});


module.exports = event;