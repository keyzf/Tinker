const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "kick",
    aliases: [],
    category: "Moderation",
    description: "Kick a member from the server",
    usage: "<@user> <reason>"
});

command.setLimits({
    cooldown: 1,
    limited: false
});

command.setPerms({
    userPermissions: ["KICK_MEMBERS"],
    botPermissions: ["KICK_MEMBERS"]
});


command.setExecute(async (client, message, args, cmd) => {
    if (!message.member.hasPermission('KICK_MEMBERS')) return message.reply('you do not have permissions to use this command!');

    let target = message.guild.member(message.mentions.users.first() || await message.guild.members.fetch(args[0]));
    if (!target) return message.reply('please specify a member to kick!');
    if (target.id == message.author.id) { return message.channel.send("You cannot kick yourself"); }

    let reason = client.utility.arrEndJoin(args, " ", 1) || "No reason specified";
    
    const {logsChannel} = client.data.db.prepare("SELECT logsChannel FROM guilds where guildID=?").get(message.guild.id);
    let logs = await client.channels.fetch(logsChannel);

    client.operations.get("generateInfraction")(target.user.id, message.guild.id, "KICK", reason, message.author.id, message.channel.id);

    await target.send(`You have been kicked from ${message.guild.name} by ${message.author.tag} for: ${reason}`);

    try {
        target.kick(reason);
    } catch (err) {
        logger.error(err, { channel: message.channel, content: message.content })
        const e = await client.operations.get("generateError")(err, "Failed to kick user", { channel: message.channel, content: message.content });
        message.channel.send(e);
        return;
    }
    message.channel.send(`${target.user.username} was kicked by ${message.author} for ${reason}`);

    if (!logs) return message.reply(`please set a logging channel to log the kicks`);
    let embed = new discord.MessageEmbed()
        .setColor('#FF0000')
        .setThumbnail(target.user.displayAvatarURL())
        .addField('Kicked Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Kicked By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Kicked Time', message.createdAt.toLocaleString())
        .addField('Kicked At', message.channel)
        .addField('Kicked Reason', reason)
        .setFooter('Kicked user information', target.user.displayAvatarURL());
    logs.send(embed);
});

module.exports = command;