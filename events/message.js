const { bot } = require("../index");
const { db, Fields } = require("../lib/db.js");
const logger = require("../lib/logger");
const Discord = require("discord.js");
const { devs } = require("../config/devs.json");
const setResponses = require("../data/setResponse");
const generateDefaultEmbed = require("../util/generateDefaultEmbed");
const deleteCatch = require("../util/deleteCatch");
const { noMessagesHandling } = require("../lib/pm2Metrics");

// error codes https://www.voucherify.io/generator

module.exports.run = async(message) => {
    noMessagesHandling.inc()

    // if the message sent was from a bot then completely ignore it (return)
    if (message.author.bot) {
        return noMessagesHandling.dec();
    }
    // if the message was sent to the bot through a dm (direct message) send a response to head to the server
    if (message.channel.type === "dm") {
        message.channel.send("Yo dude. I'm hanging out in the server");
        return noMessagesHandling.dec();
    }

    // find the guild from the database using its id (obtained from the sent message)
    const dbGuild = db.prepare(`Select * FROM guilds WHERE ${Fields.GuildFields.guildID}='${message.guild.id}'`).get();
    if (!dbGuild) {
        message.channel.send(setResponses.noDbGuildFound("db-Fs8-6Ps-Jyp"));
        bot.emit("guildCreate", message.guild);
        return noMessagesHandling.dec()
    }

    // get desired settings for this guild
    // convert from sql TEXT to json array
    if (dbGuild.ignoredSpamChannels) dbGuild.ignoredSpamChannels = dbGuild.ignoredSpamChannels.split(",");
    else dbGuild.ignoredSpamChannels = []

    // get the desired prefix for this guild
    let prefix = dbGuild.prefix;

    // check if a user was mentioned and get the first one
    if (message.mentions.users && !message.mentions.everyone) {
        // for every mentioned user
        message.mentions.users.array().forEach((user) => {
            // check the mentioned user is afk
            let mentioned = bot.afk.get(user.id);
            // if they are then tell the channel that the user is afk and for the reason the user set
            if (mentioned) {
                message.channel.send(generateDefaultEmbed({ description: `**${mentioned.usertag}** is currently afk. Reason: ${mentioned.reason}` }))
                    .then((msg) => deleteCatch(msg, 5000));
            }
        });
    }

    // check if the user that sent a message is afk
    let afkcheck = bot.afk.get(message.author.id);
    // if so remove them from the afk list as they have sent a message and are no longer afk
    if (afkcheck) {
        bot.afk.delete(message.author.id);
        message.channel.send(generateDefaultEmbed({ description: `you have been removed from the afk list!` }))
            .then(msg => deleteCatch(msg, 5000));
    }

    // if the message isnt a command then:
    if (!message.content.startsWith(prefix)) {

        const user = db.prepare(`Select * FROM users WHERE ${Fields.UserFields.guildID}='${dbGuild.guildID}' AND ${Fields.UserFields.userID}=${message.author.id}`).get();
        if (!user) return bot.cevents.get("addUser").run(message.author.id, dbGuild)
        user.messagesSent += 1;

        db.prepare(`
            UPDATE users
            SET ${Fields.UserFields.messagesSent}='${user.messagesSent}'
            WHERE ${Fields.GuildFields.guildID}='${dbGuild.guildID}' AND ${Fields.UserFields.userID}='${user.userID}';
        `).run();

        if (message.mentions.has(bot.user) && !message.mentions.everyone) {
            message.react('❕')
                .catch(error => logger.error('Failed to add reaction on bot mention: ', error));
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

        return noMessagesHandling.dec();
    }

    // split the rest of the sentence by each word (SPACE) or "many worded args"
    const input = message.content.slice(prefix.length).trim();
    const args = [];
    const preArgs = input.match(/"[^"]+"|[\S]+/g)
    if (!preArgs) {
        message.react("👋");
        return noMessagesHandling.dec();
    }
    preArgs.forEach((element) => {
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
                message.channel.send(generateDefaultEmbed(command.help.limitMessage));
                return noMessagesHandling.dec();
            }
            message.channel.send(generateDefaultEmbed({
                title: "Sorry, not for you",
                description: "This is a developer only command \nOur dev team leave commands in the bot to allow for easier testing and faster fixes, just for you!\nThese commands don't show up in the help tab and can only be accessed by our devs so you don't need to worry about them",
                fields: [
                    { name: "Something wrong?", value: "If you think this is a mistake you can get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP)" }
                ]
            }));
            return noMessagesHandling.dec();
        }
        // check if in dev command
        if (command.help.inDev && !devs.includes(message.author.id)) {
            if (command.help.inDevMessage) {
                message.channel.send(generateDefaultEmbed(command.help.inDevMessage));
                return noMessagesHandling.dec();
            }
            message.channel.send(generateDefaultEmbed({
                title: "This is in development",
                description: "This command is in development and cannot currently be used in this server\nWe are constantly adding features and improving current ones. But the way we work is that the bot should be available to everyone with as little downtime as possible. This means that sometimes a feature has to be taken offline to be improved / fixed but the bot is still running just for you.\nIf your lucky this could be a new feature that is almost ready for release!\nThese commands don't show up in the help tab and can only be accessed by our devs so you don't need to worry about them",
                fields: [
                    { name: "Something wrong?", value: "If you think this is a mistake you can get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP)" }
                ]
            }));
            return noMessagesHandling.dec();
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
                message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.help.name}\` command.`);
                return noMessagesHandling.dec();
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // run the command
        try {
            await command.run(bot, message, args, dbGuild, cmd);
        } catch (err) {
            logger.error(err.stack)
            const e = await bot.cevents.get("generateError").run(err, "Something has gone so incredibly wrong that it got all the way here...");
            message.channel.send(e)
        }

        // message.delete({ timeout: 8000 });
    } else {
        // this code runs if the command was not found (the user used the bot prefix and then an invalid command)
        bot.cevents.get("guessCommand").run(bot, message, args, dbGuild, cmd);
    }
    return noMessagesHandling.dec();
}

module.exports.help = {
    name: "message"
}