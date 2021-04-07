const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "unmute",
    aliases: [],
    category: "Moderation",
    description: "Unmute a member",
    usage: "<@ user / userID>"
});

command.setLimits({
    cooldown: 1,
    limited: false
});

command.setPerms({
    userPermissions: ["MUTE_MEMBERS"],
    botPermissions: ["MANAGE_MESSAGES", "MUTE_MEMBERS", "MANAGE_ROLES"]
});

const { MessageEmbed } = require("discord.js");

command.setExecute(async (client, message, args, cmd) => {
    let target = message.guild.member(message.mentions.users.first() || await message.guild.members.fetch(args[0]));
    if (!target) return message.reply('please specify a member to mute!');

    const [{logsChannel, muteRoleID}] = await client.data.db.query(`select logsChannel, muteRoleID from guilds where guildID='${message.guild.id}'`);
    let logs = logsChannel ? await client.channels.fetch(logsChannel) : null;

    let muteRole = await message.guild.roles.fetch(muteRoleID);

    console.log(typeof muteRole)
    // if(typeof muteRole != "")

    try {
        await target.roles.remove(muteRole);
    } catch ({stack}) {
        client.logger.error(stack, { channel: message.channel, content: message.content })
        const e = await client.operations.generateError.run(stack, "Failed to revoke the mute", { channel: message.channel, content: message.content });
        message.channel.send(e);
        return;
    }
    await target.send(`You have been unmuted in ${message.guild.name} by ${message.author.tag}`);
    message.channel.send(`${target.user.username} was unmuted by ${message.author}`);

    if (!logs) return message.channel.send(`Please set a logging channel to log the unmutes`).then((msg) => client.operations.deleteCatch.run(msg, 5000));

    let embed = new MessageEmbed()
        .setColor('#00FF00')
        .setThumbnail(target.user.displayAvatarURL())
        .addField('Unmuted Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Unmuted By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Unmuted Time', message.createdAt)
        .setFooter('Unmuted user information', target.user.displayAvatarURL());
    logs.send(embed);
});

module.exports = command;