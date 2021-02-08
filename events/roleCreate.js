const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "roleCreate"
});

event.setExecute((client, role) => {
    return;
});


module.exports = event;