const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "checkAnnouncement"
});

const { MessageEmbed } = require("discord.js");

op.setExecute(async(client) => {
    let announcements = client.data.db.prepare(`SELECT * FROM announcements`).all();
    for (let a of announcements) {
        // if passed release time
        if (a.releaseTime < Date.now()) {
            // send the announcement
            const webhook = await client.fetchWebhook(a.webhookID);
            const embed = new MessageEmbed();
            embed.setColor("#ff00ff");
            embed.setTitle(a.announcementName);
            embed.setDescription(a.announcementDescription);
            embed.setTimestamp();
            embed.setFooter(a.announcementID)
            try {
                webhook.send("", {
                    "username": webhook.name,
                    "embeds": [embed]
                });
                // mark announcement as released
                client.data.db.prepare(`
                    DELETE FROM announcements
                    WHERE announcementID=?;
                `).run(a.announcementID);
            } catch (err) {
                client.logger.error(err.stack);
            }
        }
    }
});
module.exports = op;