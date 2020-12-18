const { bot } = require("../index");
const { db, Fields } = require("../lib/db.js");
const logger = require("../lib/logger");
const Discord = require("discord.js");
const { devs } = require("../config/devs.json");
const setResponses = require("../data/setResponse");
const generateDefaultEmbed = require("../util/generateDefaultEmbed");
const deleteCatch = require("../util/deleteCatch");
// error codes https://www.voucherify.io/generator

module.exports.run = async(message) => {
    // if the message sent was from a bot then completely ignore it (return)
    if (message.author.bot) { return; }
    // if the message was sent to the bot through a dm (direct message) send a response to head to the server
    if (message.channel.type === "dm") { return message.channel.send("Yo dude. I'm hanging out in the server"); }

    // find the guild from the database using its id (obtained from the sent message)
    const dbGuild = db.prepare(`Select * FROM guilds WHERE ${Fields.GuildFields.guildID}='${message.guild.id}'`).get();
    if (!dbGuild) {
        message.channel.send(setResponses.noDbGuildFound("db-Fs8-6Ps-Jyp"));
        return bot.emit("guildCreate", message.guild);
    }

    // get desired settings for this guild
    // convert from sql TEXT to json array
    if (dbGuild.ignoredSpamChannels) dbGuild.ignoredSpamChannels = dbGuild.ignoredSpamChannels.split(",");
    else dbGuild.ignoredSpamChannels = []

    // get the desired prefix for this guild
    let prefix = dbGuild.prefix;

    // check if a user was mentioned and get the first one
    if (message.mentions.users) {
        // for every mentioned user
        message.mentions.users.array().forEach((user) => {
            // check the mentioned user is afk
            let mentioned = bot.afk.get(user.id);
            // if they are then tell the channel that the user is afk and for the reason the user set
            if (mentioned) message.channel.send(`**${mentioned.usertag}** is currently afk. Reason: ${mentioned.reason}`).then((m) => m.delete({ timeout: 5000 }));
        });
    }

    // check if the user that sent a message is afk
    let afkcheck = bot.afk.get(message.author.id);
    // if so remove them from the afk list as they have sent a message and are no longer afk
    if (afkcheck)[bot.afk.delete(message.author.id), message.reply(`you have been removed from the afk list!`).then(msg => msg.delete({ timeout: 5000 }))];

    // if the message isnt a command then:
    if (!message.content.startsWith(prefix)) {

        if (message.mentions.has(bot.user)) {
            message.react('❕')
                .catch(error => logging.log("error", 'Failed to add reaction on bot mention: ', error));
            // message.reply("are you talking about me!?");
        }

        if (dbGuild.profanityFilter) {
            const prof = await bot.cevents.get("messageProfanityCheck").run(message, dbGuild);
            if (prof) {
                await message.delete({ timeout: 0 })
                message.channel.send(`${message.author} said: "${prof}"`)
            }
        }
        if (dbGuild.preventSpam) { await bot.cevents.get("messageSpamCheck").run(message, dbGuild); }
        if (dbGuild.messageRewards) { await bot.cevents.get("messageReward").run(message, dbGuild); }

        return
    }

    // split the rest of the sentence by each word (SPACE) or "many worded args"
    const input = message.content.slice(prefix.length).trim();
    const args = [];
    input.match(/"[^"]+"|[\S]+/g).forEach((element) => {
        if (!element) return null;
        return args.push(element.replace(/"/g, ''));
    });
    // console.log(args);
    // get the command keyword (first word after prefix)
    // this is the first argument so remove it from the args list with shift()
    let cmd = args.shift().toLowerCase();
    // prepare variable for getting the actual command
    let command;

    // get command
    if (bot.commands.has(cmd)) {
        command = bot.commands.get(cmd);
    } else {
        // or any aliases there are
        command = bot.commands.get(bot.aliases.get(cmd));
    }

    // if the command was found (or any of its aliases)
    if (command) {

        // check if dev only command
        if (command.help.limit && !devs.includes(message.author.id)) {
            if (command.help.limitMessage) {
                return message.channel.send(generateDefaultEmbed(command.help.limitMessage))
            }
            return message.channel.send(generateDefaultEmbed({
                title: "Sorry, not for you",
                description: "This is a developer only command \nOur dev team leave commands in the bot to allow for easier testing and faster fixes, just for you!\nThese commands don't show up in the help tab and can only be accessed by our devs so you don't need to worry about them",
                fields: [
                    { name: "Something wrong?", value: "If you think this is a mistake you can get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP)"}
                ]
            }))
        }
        // check if in dev command
        if (command.help.inDev && !devs.includes(message.author.id)) {
            if (command.help.inDevMessage) {
                return message.channel.send(generateDefaultEmbed(command.help.inDevMessage))
            }
            return message.channel.send(generateDefaultEmbed({
                title: "This is in development",
                description: "This command is in development and cannot currently be used in this server\nWe are constantly adding features and improving current ones. But the way we work is that the bot should be available to everyone with as little downtime as possible. This means that sometimes a feature has to be taken offline to be improved / fixed but the bot is still running just for you.\nIf your lucky this could be a new feature that is almost ready for release!\nThese commands don't show up in the help tab and can only be accessed by our devs so you don't need to worry about them",
                fields: [
                    { name: "Something wrong?", value: "If you think this is a mistake you can get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP)"}
                ]
            }))
        }

        // check for cooldown
        // handles cooldown time for commands (set to 0 OR leave blank for no cooldown)
        if (!bot.cooldowns.has(command.help.name)) {
            bot.cooldowns.set(command.help.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = bot.cooldowns.get(command.help.name);
        const cooldownAmount = (command.help.cooldown || 0) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.help.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // run the command
        try {
            await command.run(bot, message, args, dbGuild, cmd);
        } catch (err) {
            logger.log("error", err.stack)
            message.channel.send(setResponses.fatalErrorToUser())
        }

        // message.delete({ timeout: 8000 });
    } else {
        // this code runs if the command was not found (the user used the bot prefix and then an invalid command)
        message.react("🤦‍♂️")
        message.channel.send(`Need a hand? Type \`${dbGuild.prefix}help\``)
            .then((msg) => {
                deleteCatch(msg, 5000);
            });
    }
}

module.exports.help = {
    name: "message"
}