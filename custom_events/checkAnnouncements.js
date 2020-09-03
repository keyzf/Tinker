const { bot } = require('../index');
const logger = require("../lib/logger");
const { db, Fields } = require("../lib/db");
const Discord = require("discord.js")

module.exports.run = async() => {
    let announcements = db.prepare(`SELECT * FROM announcements`).all();
    for (let a of announcements) {
        // check for announcement releases
        if (!a.released) {
            // if passed release time
            if (a.releaseTime < Date.now()) {
                // send the announcement
                const webhook = await bot.fetchWebhook(a.webhookID);
                const deadline = new Date(a.announcementDeadline);
                const embed = new Discord.MessageEmbed();
                embed.setColor("#ff00ff");
                embed.setTitle(a.announcementName);
                embed.setDescription(a.announcementDescription);
                embed.setFooter(`Announcement ID: ${a.announcementID}`);
                embed.setTimestamp();

                try {
                    webhook.send("", {
                        "username": webhook.name,
                        "embeds": [embed]
                    });
                    // mark announcement as released
                    db.prepare(`
                        DELETE FROM announcements
                        WHERE ${Fields.AnnouncementFields.announcementID}='${a.announcementID}';
                    `).run();
                } catch (err) {
                    logger.error(err.stack);
                }
            }
        }
    }
}


module.exports.help = {
    name: "checkAnnouncements"
}