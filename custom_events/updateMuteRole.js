const { bot } = require("../index");
const { db, Fields } = require("../lib/db");
const Discord = require("discord.js")

module.exports.run = (dbGuild, id) => {
    return new Promise(async(resolve, reject) => {
        const guild = bot.guilds.cache.get(dbGuild.guildID);
        if (id) db.prepare(`UPDATE guilds SET ${Fields.GuildFields.muteRoleID}=${id} WHERE ${Fields.GuildFields.guildID}=${dbGuild.guildID}`).run();
        else id = db.prepare(`SELECT ${Fields.GuildFields.muteRoleID} from guilds WHERE ${Fields.GuildFields.guildID}=${dbGuild.guildID}`).get().muteRoleID
        await guild.roles.fetch();
        let muteRole = guild.roles.cache.get(id);
        if (!muteRole) {
            muteRole = await guild.roles.create({
                data: {
                    name: 'Muted',
                    color: 'RED',
                },
                permissions: new Discord.Permissions(66560),
                reason: 'mute users',
            });
            db.prepare(`UPDATE guilds SET ${Fields.GuildFields.muteRoleID}=${muteRole.id} WHERE ${Fields.GuildFields.guildID}=${dbGuild.guildID}`).run();
        }
        guild.channels.cache.forEach(async(channel, cahnnelID) => {
            await channel.createOverwrite(muteRole, {
                SEND_MESSAGES: false,
                // MANAGE_MESSAGES: false,
                // READ_MESSAGES: false,
                ADD_REACTIONS: false
            });
        });

        resolve(muteRole)
    });
}

module.exports.help = {
    name: "updateMuteRole"
}