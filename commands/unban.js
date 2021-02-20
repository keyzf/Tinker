const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "unban",
    aliases: [],
    category: "Moderation",
    description: "Unban a user",
    usage: "<userID>"
});

command.setLimits({
    cooldown: 1,
    limited: false
});

command.setPerms({
    userPermissions: ["BAN_MEMBERS"],
    botPermissions: []
});


command.setExecute(async (client, message, args, cmd) => {
    let target = await message.guild.members.fetch(args[0]);
    if (!target) return message.reply('please specify a valid member to unban!');

    const {logsChannel} = client.data.db.prepare("SELECT logsChannel FROM guilds where guildID=?").get(message.guild.id);
    let logs = logsChannel ? await client.channels.fetch(logsChannel) : null;

    try {
        message.guild.members.unban(target);
    } catch (err) {
        client.logger.error(err, { channel: message.channel, content: message.content })
        const e = await client.operations.get("generateError")(err, "Failed to unban user", { channel: message.channel, content: message.content });
        message.channel.send(e);
        return;
    }

    await target.send(`You have been unbanned from ${message.guild.name} by ${message.author.tag}`);
    message.channel.send(`${target.username} was unbanned by ${message.author}`);

    if (!logs) return message.reply(`please set a logging channel to log the unbans`).then((msg) => client.operations.get("deleteCatch")(msg, 5000));

    let embed = new Discord.MessageEmbed()
        .setColor("#00FF00")
        .setThumbnail(target.displayAvatarURL())
        .addField('Unbanned Member', `${target.username} with an ID: ${target.id}`)
        .addField('Unbanned By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Unbanned Time', message.createdAt.toLocaleString())
        .setFooter('Unbanned user information', target.displayAvatarURL());
    logs.send(embed);
});

module.exports = command;