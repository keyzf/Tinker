const { bot } = require("../index");
const { db, Fields } = require("../lib/db");
const logger = require("../lib/logger");
const Discord = require("discord.js")

module.exports.run = async() => {
    logger.debug("update");
    // return null;
    // in dev

    // ## EVENTS
    let events = db.prepare(`SELECT * FROM events`).all();
    for (e of events) {
        // check for event releases
        if (!e.released) {
            // if passed release time
            if (e.releaseTime < Date.now()) {
                // send the event
                const webhook = await bot.fetchWebhook(e.webhookID);
                const deadline = new Date(e.eventDeadline);
                // console.log(webhook)
                const embed = new Discord.MessageEmbed()
                embed.setColor("#ff00ff")
                embed.setTitle(e.eventName)
                embed.setDescription(e.eventDescription)
                embed.addFields(
                    { name: "Deadline", value: deadline.toLocaleDateString() + " " + deadline.toLocaleTimeString() }
                )
                embed.setFooter("Good Luck!")
                embed.setTimestamp()
                
                try {
                    webhook.send("", {
                        "username": "DevTrials",
                        "embeds": [embed]
                    });
                    // mark event as released
                    db.prepare(`
                        UPDATE events
                        SET released='1'
                        WHERE eventID='${e.eventID}';
                    `).run()
                } catch (err) {
                    logger.log("error", err.stack)
                }
            }
        } else {
            // if passed deadline time
            if (e.eventDeadline < Date.now()) {
                // end the event
            }
        }
    }



}

module.exports.help = {
    name: "update"
}