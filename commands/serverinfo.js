'use strict';

const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "serverinfo",
    aliases: ["guildinfo", "serverstats", "guildstats"],
    category: "Guild",
    description: "Info about the server",
    usage: ""
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.guild.serverinfo"],
    memberPermissions: ["command.guild.serverinfo"]
});

command.setExecute(async(client, message, args, cmd) => {
    const { guild } = message;
    const [{ description, badges }] = await client.data.db.query(`select description, badges from guilds where guildID='${message.guild.id}'`);

    message.channel.send(client.operations.generateEmbed.run({
        title: guild.name,
        description: description || "No custom description set",
        fields: [
            { name: "Owner", value: guild.owner.user.tag, inline: true },
            { name: "Created At", value: new Date(guild.createdTimestamp).toLocaleString(), inline: true },
            { name: "Discord Boost Tier", value: guild.premiumTier, inline: true },
            { name: "Members", value: guild.memberCount, inline: true },
            { name: "Roles", value: guild.roles.cache.size, inline: true },
            { name: "Channels", value: guild.channels.cache.size, inline: true },
            { name: "Emojis", value: guild.emojis.cache.size, inline: true },
            {
                name: "Badges",
                value: (() => {
                    if (badges) {
                        badgesArr = badges.split(",");
                        badgesArr = badgesArr.map((badge) => {
                            return `${client.data.guildBadges[badge].emoji} ${client.data.guildBadges[badge].name}`
                        });
                        return badgesArr.join(", ");
                    }
                    return "None"
                })(),
                inline: true
            }
        ],
        thumbnailUrl: guild.iconURL(),
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
});

module.exports = command;