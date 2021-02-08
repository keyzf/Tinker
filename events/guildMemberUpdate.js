const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildMemberUpdate"
});

event.setExecute((client, oldMember, newMember) => {
    return;
});


module.exports = event;