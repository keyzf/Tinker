const { db, Fields } = require("../../lib/db");
const { v4: uuidv4 } = require("uuid");

module.exports.run = async(bot, message, args, dbGuild, cmd) => {
    const eventID = uuidv4();
    let releaseDate = Date.now() + (args[2] * 1000 * 60);
    let eventDeadline = Date.now() + (args[3] * 1000 * 60 * 60)
    db.prepare(`
        INSERT INTO events(${Fields.EventFields.guildID}, ${Fields.EventFields.eventName}, ${Fields.EventFields.eventDescription}, ${Fields.EventFields.releaseTime}, ${Fields.EventFields.eventDeadline}, ${Fields.EventFields.eventID}, ${Fields.EventFields.webhookID})
        VALUES('${dbGuild.guildID}', '${args[0]}', '${args[1]}', '${releaseDate}', '${eventDeadline}', '${eventID}', '${args[4]}');
    `).run();
    message.channel.send("Event Created")

};

module.exports.help = {
    name: 'devsevent',
    aliases: ["event"],
    description: "Create a Devs event",
    usage: "\"[Event Name]\" \"[Event Description]\" \"[Release Time (m)]\" \"[Event Time (h)]\" \"[Webhook ID]\"",
    cooldown: 5,
    limit: true
};