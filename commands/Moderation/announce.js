const { db, Fields } = require("../../lib/db");
const { v4: uuidv4 } = require("uuid");

module.exports.run = async(bot, message, args, dbGuild) => {
    if (!message.member.hasPermission("MANAGE_WEBHOOKS") || !message.member.hasPermission("MANAGE_MESSAGES")) { return message.channel.send("You are not authorized to do this!"); }
    if (!message.guild.me.hasPermission("MANAGE_WEBHOOKS")) { return message.channel.send("I can't make the webhook"); }

    if (!args[2]) { return message.channel.send(`Not enough arguments provided: ${this.help.usage}`); }
    if (typeof args[0] != "string") { return message.channel.send(`Announcement name should be text e.g. "DevsAnnouncement!"`); }
    if (typeof args[1] != "string") { return message.channel.send(`Announcement description should be text e.g. "A fun announcement\nThat might be interesting"`); }
    try { parseInt(args[2]) } catch { return message.channel.send(`Announcement release time should be a number e.g. "120" (this will release in 2 hours - 120 mins)`); }

    let channel;
    if (args[3]) { channel = bot.channels.cache.get(args[3].match(/\<\#(?<channelId>[0-9]+)\>/).groups.channelId); } else { channel = message.channel; }
    // does not work
    // if (!message.member.permissionIn(channel.id).hasPermission('SEND_MESSAGES')) { return message.channel.send("You are not allowed to send messages in this channel"); }
    let hooks = await channel.fetchWebhooks();
    let hook = hooks.find((hook) => { return (hook.name == "DevsApp Announcer" && hook.owner.id == bot.user.id) });

    if (!hook) { hook = await channel.createWebhook("DevsApp Announcer", { avatar: "./res/devsbot500x500.png" }); }

    const announcementID = uuidv4();
    let releaseDate = Date.now() + (args[2] * 1000 * 60);
    db.prepare(`
        INSERT INTO announcements(${Fields.AnnouncementFields.guildID}, ${Fields.AnnouncementFields.announcementName}, ${Fields.AnnouncementFields.announcementDescription}, ${Fields.AnnouncementFields.releaseTime}, ${Fields.AnnouncementFields.announcementID}, ${Fields.AnnouncementFields.webhookID})
        VALUES(?, ?, ?, ?, ?, ?);
    `).run(dbGuild.guildID, args[0], args[1], releaseDate, announcementID, hook.id);
    const m = await message.channel.send("Announcement Created");
    message.delete({ timeout: 0 });
    m.delete({ timeout: 5000 });

};

module.exports.help = {
    name: 'announce',
    aliases: [],
    description: "Create an announcement",
    usage: "\"[Announcement Name]\" \"[Announcement Description]\" \"[Release Time (m)]\"",
    cooldown: 5
};