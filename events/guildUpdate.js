const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildUpdate"
});

event.setExecute((client, guild) => {
    return;
});


module.exports = event;