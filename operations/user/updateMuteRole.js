const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "updateMuteRole"
});

op.setPerms({
    botPermissions: ["MANAGE_ROLES", "MANAGE_CHANNELS"]
})

const Discord = require("discord.js");

op.setExecute(async(client, guildID, id, channel) => {
    if (!op.checkPerms(channel.guild, channel)) {
        return;
    }

    const guild = await client.guilds.fetch(guildID);
    if (id) {
        await client.data.db.query(`update guilds set muteRoleID='${id}' where guildID='${guildID}'`);
    } else {
        const [{ muteRoleID }] = await client.data.db.query(`select muteRoleID from guilds where guildID='${guildID}'`);
        id = muteRoleID;
    }
    let muteRole = await guild.roles.fetch(id || "stand-in");

    if (!muteRole) {
        muteRole = await guild.roles.create({
            data: {
                name: 'Muted',
                color: 'RED',
            },
            permissions: new Discord.Permissions(66560),
            reason: 'mute users',
        });
        await client.data.db.query(`update guilds set muteRoleID='${muteRole.id}' where guildID='${guildID}'`);
    }
    await guild.channels.cache.forEach(async(channel, channelID) => {
        try {
            await channel.updateOverwrite(muteRole, {
                SEND_MESSAGES: false,
                // MANAGE_MESSAGES: false,
                // READ_MESSAGES: false,
                ADD_REACTIONS: false,
                SPEAK: false
            });
        } catch(err) {
            client.logger.debug(`updateMuteRole: Failed to change channel overrides for ${channel.name} (${channel.id}), ${err}`);
        }
    });

    return muteRole
});

module.exports = op;