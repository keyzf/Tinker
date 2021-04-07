const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "ban",
    aliases: [],
    category: "Moderation",
    description: "Ban a user from the server indefinitely",
    usage: "<user> <reason>"
});

command.setLimits({
    cooldown: 1,
    limited: false
});

command.setPerms({
    userPermissions: ["BAN_MEMBERS"],
    botPermissions: ["MANAGE_MESSAGES", "BAN_MEMBERS"]
});

const { MessageEmbed } = require("discord.js");

command.setExecute(async(client, message, args, cmd) => {
    let target = message.guild.member(message.mentions.users.first() || await message.guild.members.fetch(args[0]));
    if (!target) return message.channel.send('please specify a member to ban!');
    if (target.id === message.author.id) { return message.channel.send("You cannot ban yourself"); }

    let reason = client.utility.arrEndJoin(args, " ", 1) || "No reason specified";

    const [{logsChannel}] = await client.data.db.query(`select logsChannel from guilds where guildID='${message.guild.id}'`);
    
    let logs = logsChannel ? await client.channels.fetch(logsChannel) : null;

    client.operations.generateInfraction.run(target.user.id, message.guild.id, "BAN", reason, message.author.id, message.channel.id)
    await target.send(`You have been banned from ${message.guild.name} by ${message.author.tag} for: ${reason}`);
    try {
        // TODO: provide {days: Number} to delete messages that the user has sent this far into the past
        target.ban({reason});
    } catch ({stack}) {
        client.logger.error(stack, { channel: message.channel, content: message.content, origin: __filename });
        const e = await client.operations.generateError.run(stack, "Failed to ban user", { channel: message.channel, content: message.content, origin: __filename });
        message.channel.send(e);
        return;
    }
    message.channel.send(`${target.user.username} was banned by ${message.author} for ${reason}`);

    if (!logs) return message.channel.send(`please set a logging channel to log the bans`).then((msg) => client.operations.deleteCatch.run(msg, 5000));
    let embed = new MessageEmbed()
        .setColor('#FF0000')
        .setThumbnail(target.user.displayAvatarURL())
        .addField('Banned Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Banned By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Banned Time', message.createdAt.toLocaleString())
        .addField('Banned At', message.channel)
        .addField('Banned Reason', reason)
        .setFooter('Banned user information', target.user.displayAvatarURL());
    logs.send(embed);
});

module.exports = command;