const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "updateMuteRole"
});

op.setExecute(async(client, guildID, id) => {
    const guild = client.guilds.cache.get(guildID);
    if (id) client.data.db.prepare(`UPDATE guilds SET muteRoleID=${id} WHERE guildID=${guildID}`).run();
    else id = client.data.db.prepare(`SELECT muteRoleID from guilds WHERE guildID=${guildID}`).get().muteRoleID
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
        client.data.db.prepare(`UPDATE guilds SET muteRoleID=${muteRole.id} WHERE guildID=${guildID}`).run();
    }
    guild.channels.cache.forEach(async(channel, channelID) => {
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