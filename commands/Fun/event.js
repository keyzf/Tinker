const { db, Fields } = require("../../lib/db");
const { v4: uuidv4 } = require("uuid");

module.exports.run = async(bot, message, args, dbGuild) => {
    if (!message.member.hasPermission("MANAGE_WEBHOOKS") || !message.member.hasPermission("MANAGE_MESSAGES")) { return message.channel.send("You are not authorized to do this!"); }
    if (!message.guild.me.hasPermission("MANAGE_WEBHOOKS")) { return message.channel.send("I can't make the webhook"); }

    if (!args[3]) { return message.channel.send(`Not enough arguments provided: ${this.help.usage}`); }
    if (typeof args[0] != "string") { return message.channel.send(`Event name should be text e.g. "Big Event!"`); }
    if (typeof args[1] != "string") { return message.channel.send(`Event description should be text e.g. "A fun event\nThat anyone can do"`); }
    try { parseInt(args[2]) } catch { return message.channel.send(`Event release time should be a number e.g. "120" (this will release in 2 hours - 120 mins)`); }
    try { parseInt(args[3]) } catch { return message.channel.send(`Event duration time should be a number e.g. "8" (this will last 8 hours)`); }

    let channel;
    if (args[4]) { channel = bot.channels.cache.get(args[4].match(/\<\#(?<channelId>[0-9]+)\>/).groups.channelId); } else { channel = message.channel; }
    // does not work
    // if (!message.member.permissionIn(channel.id).hasPermission('SEND_MESSAGES')) { return message.channel.send("You are not allowed to send messages in this channel"); }
    let hooks = await channel.fetchWebhooks();
    let hook = hooks.find((hook) => { return (hook.name == "Tinker Announcer" && hook.owner.id == bot.user.id) });

    if (!hook) { hook = await channel.createWebhook("Tinker Announcer", { avatar: "./res/devsbot500x500.png" }); }

    const eventID = uuidv4();
    let releaseDate = Date.now() + (args[2] * 1000 * 60);
    let eventDeadline = Date.now() + (args[3] * 1000 * 60 * 60)
    db.prepare(`
        INSERT INTO events(${Fields.EventFields.guildID}, ${Fields.EventFields.eventName}, ${Fields.EventFields.eventDescription}, ${Fields.EventFields.releaseTime}, ${Fields.EventFields.eventDeadline}, ${Fields.EventFields.eventID}, ${Fields.EventFields.webhookID})
        VALUES('${dbGuild.guildID}', '${args[0]}', '${args[1]}', '${releaseDate}', '${eventDeadline}', '${eventID}', '${hook.id}');
    `).run();
    const m = await message.channel.send("Event Created");
    message.delete({ timeout: 0 });
    m.delete({ timeout: 5000 });

};

module.exports.help = {
    name: 'event',
    aliases: [],
    description: "Create an event",
    usage: "\"[Event Name]\" \"[Event Description]\" \"[Release Time (m)]\" \"[Event Time (h)]\"",
    cooldown: 5
};