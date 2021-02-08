const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "roleUpdate"
});

event.setExecute((client, oldRole, newRole) => {
    return;
});


module.exports = event;