const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "updateMuteRole"
});

op.setPerms({
    botPermissions: ["MANAGE_ROLES", "MANAGE_CHANNELS"]
})

const Discord = require("discord.js");

op.setExecute(async (client, guildID, id, channel) => {
    if (!op.checkPerms(channel.guild, channel)) {
        return;
    }

    const guild = await client.guilds.fetch(guildID);
    if (id) {
        await client.data.db.set({
            table: "guilds", field_data: {
                muteRoleID: id
            }, conditions: [`guildID='${guildID}'`]
        });
    } else {
        const {muteRoleID} = await client.data.db.getOne({
            table: "guilds",
            fields: ["muteRoleID"],
            conditions: [`guildID='${guildID}'`]
        })
        id = muteRoleID;
    }
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
        await client.data.db.set({
            table: "guilds", field_data: {
                muteRoleID: muteRole.id
            }, conditions: [`guildID='${guildID}'`]
        });
    }
    await guild.channels.cache.forEach(async (channel, channelID) => {
        await channel.updateOverwrite(muteRole, {
            SEND_MESSAGES: false,
            // MANAGE_MESSAGES: false,
            // READ_MESSAGES: false,
            ADD_REACTIONS: false,
            SPEAK: false
        });
    });

    return (muteRole)
});

module.exports = op;