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
    cooldown: 1
});

command.setPerms({
    userPermissions: ["KICK_MEMBERS"],
    botPermissions: ["MANAGE_MESSAGES", "KICK_MEMBERS"],
    globalUserPermissions: ["user.command.moderation.kick"],
    memberPermissions: ["command.moderation.kick"]
});

command.setExecute(async (client, message, args, cmd) => {
    let target;
    try {
        if (!args[0]) throw Error()
        target = message.guild.member(message.mentions.users.first())
        if (!target) {
            target = await message.guild.members.fetch(args[0]);
        };
    } catch {}
    if (!target) { return message.reply('please specify a member to kick!') };
    if (target.user.bot) { return message.channel.send("You cannot perform moderation actions on bots") }
    if (target.id === message.author.id) { return message.channel.send("You cannot kick yourself"); }

    let reason = client.utility.arrEndJoin(args, " ", 1) || "No reason specified";

    const [{logsChannel}] = await client.data.db.query(`select logsChannel from guilds where guildID='${message.guild.id}'`);
    let logs = logsChannel ? await client.channels.fetch(logsChannel) : null;

    client.generateInfraction.run(target.user.id, message.guild.id, "KICK", reason, message.author.id, message.channel.id);

    await target.send(`You have been kicked from ${message.guild.name} by ${message.author.tag} for: ${reason}`);

    try {
        await target.kick(reason);
    } catch (err) {
        client.logger.error(err, { channel: message.channel, content: message.content })
        const e = await client.generateError.run(err, "Failed to kick user", { channel: message.channel, content: message.content });
        message.channel.send(e);
        return;
    }
    message.channel.send(`${target.user.username} was kicked by ${message.author} for ${reason}`);

    if (!logs) return message.reply(`please set a logging channel to log the kicks`).then((msg) => client.deleteCatch.run(msg, 5000));
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