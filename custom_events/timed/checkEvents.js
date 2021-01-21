const { bot } = require('../../index');
const logger = require("../../lib/logger");
const { db, Fields } = require("../../lib/db");
const Discord = require("discord.js");

module.exports.run = async() => {
    let events = db.prepare(`SELECT * FROM events`).all();
    for (let e of events) {
        // check for event releases
        if (!e.released) {
            // if passed release time
            if (e.releaseTime < Date.now()) {
                // send the event
                const webhook = await bot.fetchWebhook(e.webhookID);
                const deadline = new Date(e.eventDeadline);
                const embed = new Discord.MessageEmbed();
                embed.setColor("#ff00ff");
                embed.setTitle(e.eventName);
                embed.setDescription(e.eventDescription);
                embed.addFields({ name: "Deadline", value: deadline.toLocaleDateString() + " " + deadline.toLocaleTimeString() });
                embed.setFooter("Good Luck!");
                embed.setTimestamp();

                try {
                    webhook.send("", {
                        "username": webhook.name,
                        "embeds": [embed]
                    });
                    // mark event as released
                    db.prepare(`
                        UPDATE events
                        SET ${Fields.EventFields.released}='1'
                        WHERE ${Fields.EventFields.eventID}='${e.eventID}';
                    `).run();
                } catch (err) {
                    logger.error(err.stack);
                }
            }
        } else {
            // if passed deadline time
            if (e.eventDeadline < Date.now()) {
                // end the event
                const webhook = await bot.fetchWebhook(e.webhookID);
                const deadline = new Date(e.eventDeadline);
                const embed = new Discord.MessageEmbed();
                embed.setColor("#ff00ff");
                embed.setTitle(`${e.eventName}: Has finished!`);
                embed.setDescription(`It has passed the deadline of ${deadline.toLocaleDateString() + " " + deadline.toLocaleTimeString()}!`);
                embed.setFooter("Stop right there!");
                embed.setTimestamp();

                try {
                    webhook.send("", {
                        "username": webhook.name,
                        "embeds": [embed]
                    });
                    // delete event from db
                    db.prepare(`
                        DELETE FROM events
                        WHERE ${Fields.EventFields.eventID}='${e.eventID}';
                    `).run();
                } catch (err) {
                    logger.error(err.stack);
                }
            }
        }
    }

}


module.exports.help = {
    name: "checkEvents"
}