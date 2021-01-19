const { db, Fields } = require('../../lib/db');


module.exports.run = async(bot, message, args, dbGuild) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('you do not have permissions to use this command!');

    if (!args[1]) return message.channel.send(`The proper usage would be:\n\`${this.help.usage}\``)

    let action = args[0];
    let target = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    if (!target) {
        return message.channel.send("please provide a role")
    }

    if (action == "add" || action == "push") {
        dbGuild.notifiableRoles.push(target.id);
        db.prepare(`
            UPDATE guilds
            SET ${Fields.GuildFields.notifiableRoles}='${dbGuild.notifiableRoles.join(",")}'
            WHERE guildID='${dbGuild.guildID}';
        `).run()
        return message.channel.send(`\`${target.name}\` added to notifiable roles`);

    } else if (action == "remove" || action == "pull") {
        dbGuild.ignoredSpamChannels.splice(dbGuild.ignoredSpamChannels.indexOf(target.id), 1);
        db.prepare(`
            UPDATE guilds
            SET ${Fields.GuildFields.notifiableRoles}='${dbGuild.notifiableRoles.join(",")}'
            WHERE guildID='${dbGuild.guildID}';
        `).run()
        return message.channel.send(`\`${target.name}\` removed from notifiable roles`);
    } else {
        if (!args[2]) return message.channel.send(`The proper usage would be:\n\`${this.help.usage}\``)
    }

}

module.exports.help = {
    name: "setnotifyrole",
    aliases: [],
    description: "Add roles that all users can notify",
    usage: "[add/remove] [role mention]",
    cooldown: 3,
}