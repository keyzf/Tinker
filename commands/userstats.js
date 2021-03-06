'use strict'

const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "userstats",
    aliases: ["who", "user", "userinfo"],
    category: "Moderation",
    description: "Get information about a user",
    usage: "<@ user / userID>"
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.moderation.userstats"],
    memberPermissions: ["command.moderation.userstats"]
});

const {MessageEmbed} = require("discord.js");
const moment = require("moment");

command.setExecute(async (client, message, args, cmd) => {

    let search = message.mentions.users.first() || args[0] || message.author.id
    let target;
    try {
        target = await message.guild.members.fetch({user: search, withPresence: true});
        if (!target) {
            throw Error("No target")
        }
    } catch (e) {
        return message.channel.send("Could not get member")
    }

    const [dbTargetUser] = await client.data.db.query(`select * from users where userID='${target.id}' and guildID='${message.guild.id}'`);

    const [dbTargetGlobal] = await client.data.db.query(`select * from globalUser where userID='${target.id}'`);

    let embed = new MessageEmbed()
    embed.setAuthor(`${target.user.username}#${target.user.discriminator} (${target.id})`, target.user.displayAvatarURL())
    embed.setColor(target.displayHexColor)

    embed.addField('Joined at:', `${moment.utc(target.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true);
    embed.addField('Created at:', `${moment.utc(target.user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true);
    embed.addField('Status:', target.presence.status, true);
    if (dbTargetUser) {
        embed.addField('Messages Sent:', dbTargetUser.messagesSent, true);
        embed.addField('Infractions:', (function () {
            if (!dbTargetUser.infractions) return 0
            else return dbTargetUser.infractions.split(",").length
        }()), true);
    }
    if (dbTargetGlobal) {
        embed.addFields({
            name: "Badges",
            value: (() => {
                if (dbTargetGlobal.badges) {
                    badgesArr = dbTargetGlobal.badges.split(",");
                    badgesArr = badgesArr.map((badge) => {
                        return `${client.data.userBadges[badge].emoji} ${client.data.userBadges[badge].name}`
                    });
                    return badgesArr.join(", ");
                }
                return "None"
            })(),
            inline: true
        });
        embed.addField('Gold:', dbTargetGlobal.currencyUnit2, true);
        embed.addField('Silver:', dbTargetGlobal.currencyUnit1, true);
        embed.addField('Copper:', dbTargetGlobal.currencyUnit0, true);
    }
    if (!dbTargetUser || !dbTargetGlobal) {
        embed.addField("Database User", "This user is not yet in the database so some information will not be shown, such as messages sent and currency")
    }
    embed.addField('Roles:', (function () {
        if (target.roles.cache.size <= 1) return "None"
        return target.roles.cache.sort((a, b) => {
            return b.rawPosition - a.rawPosition
        }).map((r) => `${r}`).slice(0, target.roles.cache.size-1).join(" | ")
    }()));
    embed.setFooter(`Requested by ${message.author.username}`);
    embed.setTimestamp();

    message.channel.send(embed);
    return;
});

module.exports = command;