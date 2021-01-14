const generateDefaultEmbed = require("../../util/generateDefaultEmbed");
const { db, Fields } = require("../../lib/db");

module.exports.run = async(bot, message, args, dbGuild) => {
    // TODO: make this only work once a day
    // TODO: create daily streak system
    // TODO: make daily rewards more interactive/dynamic

    const user = db.prepare(`Select * FROM users WHERE ${Fields.UserFields.guildID}='${dbGuild.guildID}' AND ${Fields.UserFields.userID}=${message.author.id}`).get();
    const dailyAmount = 20;
    user.currencyUnits += dailyAmount;

    db.prepare(`
        UPDATE users
        SET ${Fields.UserFields.messagesSent}='${user.messagesSent}', ${Fields.UserFields.currencyUnits}='${user.currencyUnits}'
        WHERE ${Fields.GuildFields.guildID}='${dbGuild.guildID}' AND ${Fields.UserFields.userID}='${user.userID}';
    `).run()

    message.channel.send(generateDefaultEmbed({
        title: "Daily",
        description: `After a day of scavenging you found ${dailyAmount} scrap pieces, you now have a total scrap value of ${user.currencyUnits}`
    }));
};

module.exports.help = {
    name: 'daily',
    aliases: ["scavenge"],
    description: "Go looking for scrap pieces",
    usage: "",
    cooldown: 1,
    limit: true
};