const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "userUpdate"
});

event.setExecute((client, oldUser, newUser) => {
    return;
});


module.exports = event;