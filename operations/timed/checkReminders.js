'use strict';

const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "checkReminders"
});

op.setExecute(async(client) => {
    const timePassedReminders = await client.data.db.query("select * from reminders where revealTime <= CURRENT_TIMESTAMP()");
    timePassedReminders.forEach(async(reminder) => {
        const user = await client.users.fetch(reminder.ownerId)
        const embed = client.operations.generateEmbed.run({
            title: "Reminder!",
            description: `${reminder.content}\n[Jump](${reminder.messageUrl})`,
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Reminding", user, `${client.statics.defaultEmbed.footerSeparator} ${reminder.id}`)
        });

        user.send(embed).catch((err) => {
            const parts = reminder.split("/");
            try {
                const channel = client.channels.fetch(parts[parts.length - 2]);
                channel.send(`<@${reminder.ownerId}>`, embed)
            } catch {
                client.logger.error("Could not DM use and msg link provided contained invalid channel or channel was removed");
            }
        });
    });
    await client.data.db.query("delete from reminders where revealTime <= CURRENT_TIMESTAMP()");
});
module.exports = op;