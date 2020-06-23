const Discord = require("discord.js")
const { botChannel, logsChannel, reportsChannel } = require("../../config/config.json");

module.exports.run = async (bot, message, args, dbGuild) => {

    const { commands } = bot;
    const e = new Discord.MessageEmbed()
    e.setFooter("The content of this command is completely generated. If anything looks off please contact us to get it fixed")
    e.setColor("#a700bd")
    e.setTimestamp()

    if (!args.length) {
        e.setTitle("Here to help!")
        e.setDescription(`We have loads of commands (\`${dbGuild.prefix}help all\`) that do so many different things!\nI also have loads of background functionality (\`${dbGuild.prefix}help function\`) that is keeping your server running smooth, safe and fun!`)
        return message.channel.send(e)
    }
    
    if (args[0].toLowerCase() == "all") {
        e.setTitle("All my Commands!");
        var text = []
        commands.array().forEach((item) => {
            if (!item.help.limit) text.push(item.help.name)
        })
        e.setDescription(text.join(", "))
        message.channel.send(e)
        return message.channel.send(`Use \`${dbGuild.prefix}help command [Command Name]\` to get help with a specific command`);
    }

    if (args[0].toLowerCase() == "function" || args[0].toLowerCase() == "functionality") {
        e.setTitle("All my functionality!")
        e.setDescription(`Everything here I do in the background so you don't have to worry!`)
        e.addFields(
            { name: "Reports channel", value: `users can report people using the ${dbGuild.prefix}report [reason] command. A channel named reports will recieve the full information about the report` },
            { name: "Profanity Filter", value: `We have a profanity filter that attempts to remove messages with rude words, swears and slurs` }
        )
        return message.channel.send(e);
    }
    
    if (args[0].toLowerCase() == "command") {

        if(!args[1]) return message.reply('That\'s not a valid command!');
        const name = args[1].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.help.aliases && c.help.aliases.includes(name));
        if (!command) return message.reply('That\'s not a valid command!');
        
        e.setTitle(command.help.name)
        e.setDescription(command.help.description || "No description set")
        e.addFields(
                { name: "Aliases", value: `${command.help.aliases.join(", ") || "No aliases set"}`, inline: true },
                { name: "Usage", value: `${(command.help.usage) ? dbGuild.prefix + command.help.name + " " + command.help.usage : "No usage advice"}`, inline: true },
                { name: "Cooldown", value: `${command.help.cooldown || 0}s`, inline: true }
            )
        return message.channel.send(e)
    }

    e.setTitle("Need a hand?")
    e.setDescription(`Use \`${dbGuild.prefix}help command [command name]\` for help with a specific command\nUse \`${dbGuild.prefix}help all\` for a list of all my commands\nUse just\`${dbGuild.prefix}help\`for all the help you could need`)
    return message.channel.send(e)
};

module.exports.help = {
    name: 'help',
    aliases: ["what", "how", "why"],
    description: "Gives you all the help you could possibly need...\n if your still stuck, head to our [Official Support Server](https://discord.gg/aymBcRP)",
    cooldown: 0
};