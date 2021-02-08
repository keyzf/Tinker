const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "help",
    aliases: ["h"],
    category: "Bot",
    description: "Shows you help on how to use the bot",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    botPermissions: [],
    userPermissions: []
});

command.registerSubCommand(`${__dirname}/help/all`);
command.registerSubCommand(`${__dirname}/help/command`);
command.registerSubCommand(`${__dirname}/help/devs`);

const { MessageEmbed } = require("discord.js");

command.setExecute(async(client, message, args, cmd) => {
    if(args.length) {
        return command.findSubcommand("command").run(message, args, cmd);
    }
    const { prefix } = client.data.db.prepare(`SELECT prefix FROM guilds WHERE guildID=?`).get(message.guild.id);
    const e = new MessageEmbed()
        .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor("#a700bd")
        .setTimestamp()
        .setTitle("Here to help!")
        .setDescription(`We have loads of commands (\`${prefix}help all\`) that do so many different things!\nI also have loads of background functionality (\`${prefix}help function\`) that is keeping your server running smooth, safe and fun!\n(don't forget our little disclaimer with \`${prefix}help disclaimer\`)\nMeet our developers by typing \`${prefix}help devs\` cause they deserve credit for everything that I am`);

    return message.channel.send(e);

});

module.exports = command;