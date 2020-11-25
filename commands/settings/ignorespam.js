const setResponses = require("../../res/setResponse");
const { db } = require("../../lib/db")

module.exports.run = async(bot, message, args, dbGuild) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("you do not have permission to use this command")

    if (!args[2]) return message.channel.send(`The proper usage would be:\n\`${this.help.usage}\``)

    var action = args[0].toLowerCase();
    var type = args[1].toLowerCase();
    var subject = args[2].toLowerCase();

    console.log(dbGuild)


    if (action == "add" || action == "push") {
        if (type == "channel") {
            dbGuild.ignoredSpamChannels.push(subject);
            console.log(dbGuild.ignoredSpamChannels)
            db.prepare(`
                UPDATE guilds
                SET ignoredSpamChannels='${dbGuild.ignoredSpamChannels.join(",")}'
                WHERE guildID='${dbGuild.guildID}';
            `).run()
            return message.channel.send(`\`${subject}\` added to ignored channels`);
        }
        // if(type == "prefix"){
        //     dbGuild.preferences.spamSettings.ignoredPrefixes.push(subject);
        //     dbGuild.markModified("preferences.spamSettings");
        //     await dbGuild.save();
        //     return message.channel.send(`\`${subject}\` added to ignored prefixes`);
        // }
    }
    if (action == "remove" || action == "pull") {
        if (type == "channel") {
            dbGuild.ignoredSpamChannels.splice(dbGuild.ignoredSpamChannels.indexOf(subject), 1);
            db.prepare(`
                UPDATE guilds
                SET ignoredSpamChannels='${dbGuild.ignoredSpamChannels.join(",")}'
                WHERE guildID='${dbGuild.guildID}';
            `).run()
            return message.channel.send(`\`${subject}\` removed from ignored channels`);
        }
        // if(type == "prefix"){
        //     dbGuild.preferences.spamSettings.ignoredPrefixes.splice(dbGuild.preferences.spamSettings.ignoredPrefixes.indexOf(subject), 1);
        //     dbGuild.markModified("preferences.spamSettings");
        //     await dbGuild.save();
        //     return message.channel.send(`\`${subject}\` removed from ignored prefixes`);
        // }
    }
    return message.channel.send(`The proper usage would be:\n\`${this.help.usage}\``)

}

module.exports.help = {
    name: "ignorespam",
    aliases: [],
    description: "Change the bots spam settings for this guild",
    usage: "[\"add\"/\"remove\"] [\"channel\"/\"prefix\"] [channelID / prefix]",
    cooldown: 10
}