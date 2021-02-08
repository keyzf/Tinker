const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "userNoteUpdated"
});

event.setExecute((client, oldNote, newNote) => {
    return;
});


module.exports = event;