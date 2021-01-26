const Discord = require("discord.js")
const { devs } = require("../../config/devs.json")

module.exports.run = async(bot, message, args, dbGuild) => {
    const { commands } = bot;
    const e = new Discord.MessageEmbed();
    // e.setFooter("The content of this command is completely generated. If anything looks off please contact us to get it fixed");
    e.setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL());
    e.setColor("#a700bd");
    e.setTimestamp();

    if (!args.length) {
        e.setTitle("Here to help!")
        e.setDescription(`We have loads of commands (\`${dbGuild.prefix}help all\`) that do so many different things!\nI also have loads of background functionality (\`${dbGuild.prefix}help function\`) that is keeping your server running smooth, safe and fun!\n(don't forget our little disclaimer with \`${dbGuild.prefix}help disclaimer\`)\nMeet our developers by typing \`${dbGuild.prefix}help devs\` cause they deserve credit for everything that I am`)
        return message.channel.send(e)
    }

    if (args[0].toLowerCase() === "all") {
        e.setTitle("All my Commands!");
        let outCommands = {}
        commands.array().forEach((item) => {
            if (!item.help.limit || devs.includes(message.author.id)) {
                let category = item.help.category.capitalize();
                if (!outCommands[category]) { outCommands[category] = []; }
                outCommands[category].push(item.help.name);
            }
        });
        let keys = Object.keys(outCommands);
        let values = Object.values(outCommands)
        for (let key in keys) {
            e.addField(keys[key], values[key].join(", "));
        }
        message.channel.send(e);
        return message.channel.send(`Use \`${dbGuild.prefix}help command [Command Name]\` to get help with a specific command`);
    }

    if (args[0].toLowerCase() == "dev" || args[0].toLowerCase() == "devs" || args[0].toLowerCase() == "developers") {
        e.setTitle("All my developers!");
        let text = [];
        for (let i=0; i<devs.length; i++) {
            let user = await bot.users.fetch(devs[i]);
            text.push(`${user.username}#${user.discriminator}`)
        }
        e.setDescription(text.join(", "))
        return message.channel.send(e)
    }

    if (args[0].toLowerCase() == "function" || args[0].toLowerCase() == "functionality") {
        e.setTitle("All my functionality!")
        e.setDescription(`Everything here I do in the background so you don't have to worry!`)
        e.addFields({ name: "Reports channel", value: `users can report people using the ${dbGuild.prefix}report [reason] command. A channel named reports will receive the full information about the report` }, { name: "Profanity Filter", value: `We have a profanity filter that attempts to remove messages with rude words, swears and slurs` })
        return message.channel.send(e);
    }

    if (args[0].toLowerCase() == "external" || args[0].toLowerCase() == "api" || args[0].toLowerCase() == "disclaimer") {
        e.setTitle("Our small disclaimer")
        e.setDescription(`Not everything I say and do is a result of my developers programming, some things come from external sources or from other users of the bot. Therefore we cannot be held responsible for the content that comes about as a result of an external source, api or other users`)
        e.addFields({ name: `${dbGuild.prefix}dadjoke and ${dbGuild.prefix}meme`, value: `These both come from external sources (icanhazdadjoke.com and reddit.com respectively)` }, { name: "Profanity Filter", value: `We have a profanity filter that attempts to remove messages with rude words, swears and slurs. The bot cannot clear this messages perfectly and catch all cases of these words. We cannot guarantee that all messages will be properly cleared` }, { name: "Moderation commands", value: `Moderators can give any reason for muting, kicking and banning users. We do not have control over the reasons specified, therefore we will not be help responsible for these reason. We also cannot handle disputes to these commands, please take those up with server moderators or admins` }, { name: "AFK reasons", value: `User can set their own reason for being afk, we cannot be held responsible for the messages sent by our bot based on afk reasons` }, { name: "Cookies", value: `We don't use those here silly!` })
        return message.channel.send(e);
    }

    if (args[0].toLowerCase() == "command") {

        if (!args[1]) return message.reply('That\'s not a valid command!');
        const name = args[1].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.help.aliases && c.help.aliases.includes(name));
        if (!command) return message.reply('That\'s not a valid command!');

        e.setTitle(command.help.name)
        e.setDescription(command.help.description || "No description set")
        e.addFields({ name: "Aliases", value: `${command.help.aliases.join(", ") || "No aliases set"}`, inline: true }, { name: "Usage", value: `${(command.help.usage) ? dbGuild.prefix + command.help.name + " " + command.help.usage : "No usage advice"}`, inline: true }, { name: "Cooldown", value: `${command.help.cooldown || 0}s`, inline: true }, { name: "Generated", value: `${command.help.generated ? "✅" : "❌"}`, inline: true })
        return message.channel.send(e)
    }

    e.setTitle("Need a hand?")
    e.setDescription(`Use \`${dbGuild.prefix}help command [command name]\` for help with a specific command\nUse \`${dbGuild.prefix}help all\` for a list of all my commands\nUse just\`${dbGuild.prefix}help\`for all the help you could need`)
    return message.channel.send(e);
};

module.exports.help = {
    name: 'help',
    aliases: ["what", "how", "why", "h"],
    description: "Gives you all the help you could possibly need...\n if your still stuck, head to our [Official Support Server](https://discord.gg/aymBcRP)",
    cooldown: 0,
    generated: true
};