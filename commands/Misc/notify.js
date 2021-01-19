const { db, Fields } = require("../../lib/db");
const { milliseconds } = require("../../util/timeConversion");

module.exports.run = async(bot, message, args, dbGuild, cmd) => {
    let roleSearchCriteria = args.join(" ");
    if (!roleSearchCriteria) { return message.channel.send("Please provide a role name to notify"); }

    let role = message.guild.roles.cache.find(r => r.name.toLowerCase().replace(" ", "_") === roleSearchCriteria.toLowerCase().replace(" ", "_"));
    if (!role) { return message.channel.send(`${roleSearchCriteria} is not a role`); }

    if (!dbGuild.notifiableRoles.length || !dbGuild.notifiableRoles.includes(role.id)) {
        return message.channel.send("You cannot notify this role");
    }

    let notify = db.prepare(`SELECT ${Fields.Notifies.timeout} FROM notifies WHERE ${Fields.Notifies.guildID}='${dbGuild.guildID}' AND ${Fields.Notifies.roleID}='${role.id}'`).get()
    if (notify) {
        if (notify.timeout < Date.now()) {
            db.prepare(`
                DELETE FROM notifies
                WHERE ${Fields.Notifies.guildID}='${dbGuild.guildID}' and ${Fields.Notifies.roleID}='${role.id}';
            `).run();
        } else {
            return message.channel.send(`You cannot notify ${role.name} again until ${new Date(notify.timeout).toLocaleString()}`);
        }
    }

    message.channel.send(`<@${message.author.id}> has notified <@&${role.id}>`);
    db.prepare(`INSERT INTO notifies(${Fields.Notifies.guildID}, ${Fields.Notifies.roleID}, ${Fields.Notifies.timeout})
        VALUES(${dbGuild.guildID}, ${role.id}, ${Date.now() + milliseconds(1, 0, 0)})
    `).run();
};

module.exports.help = {
    name: 'notify',
    aliases: ["roleping", "groupping"],
    description: "",
    usage: "[Role Name]",
    cooldown: 2,
    limit: false
};


// const { MessageEmbed } = require("discord.js")
// let rolemap = message.guild.roles.cache
//     .sort((a, b) => b.position - a.position)
//     .map(r => r)
//     .join(",");
// if (rolemap.length > 1024) rolemap = "To many roles to display";
// if (!rolemap) rolemap = "No roles";
// const embed = new MessageEmbed()
//     .addField("Role List", rolemap)
// message.channel.send(embed);