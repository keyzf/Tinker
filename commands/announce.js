const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "announce",
    aliases: [],
    category: "Moderation",
    description: "Send an announcement embed",
    usage: "\"<title>\" \"<message>\" [release time]"
});

command.setLimits({
    cooldown: 1,
    limited: true,
    limitMessage: "I know this was a feature of Tinker before the major update, however Im sure you'd much rather have a running bot!"
});

command.setPerms({
    userPermissions: ["MANAGE_MESSAGES", "MANAGE_WEBHOOKS"],
    botPermissions: ["MANAGE_WEBHOOKS"]
});

const ts = require('timestring');
const { v4: uuidv4 } = require("uuid");

command.setExecute(async(client, message, args, cmd) => {
    if (!args[1]) { return message.channel.send(`Not enough arguments provided: ${command.info.usage}`); }
    if (typeof args[0] != "string") { return message.channel.send(`Announcement name should be text e.g. "Big Announcement!"`); }
    if (typeof args[1] != "string") { return message.channel.send(`Announcement description should be text e.g. "A fun announcement\nThat might be interesting"`); }

    let time;
    if (args[2]) {
        try {
            time = ts(args[2], "ms");
        } catch (err) {
            return message.channel.send("Please provide a valid time string (e.g. 1d 3h)")
        }
    } else {
        time = 0;
    }
    let channel;
    if (args[3]) { channel = client.channels.cache.get(args[3].match(/\<\#(?<channelId>[0-9]+)\>/).groups.channelId); } else { channel = message.channel; }

    let hooks = await channel.fetchWebhooks();
    let hook = hooks.find((hook) => { return (hook.name == "Tinker Announcer" && hook.owner.id == client.user.id) });

    if (!hook) { hook = await channel.createWebhook("Tinker Announcer", { avatar: "./res/TinkerExclamation-blue.png" }); }

    const announcementID = uuidv4();
    let releaseDate = Date.now() + time;
    client.data.db.prepare(`
        INSERT INTO announcements(guildId, announcementName, announcementDescription, releaseTime, announcementID, webhookID)
        VALUES(?, ?, ?, ?, ?, ?);
    `).run(message.guild.id, args[0], args[1], releaseDate, announcementID, hook.id);
    try {
        message.author.send(`Announcement Created. ID:${announcementID}`);
    } catch (err) {
        const m = await message.channel.send(`Announcement Created. ID:${announcementID}`);
        client.operations.deleteCatch.run(m, 5000);
    }
    client.operations.deleteCatch.run(message, 0);

});

module.exports = command;