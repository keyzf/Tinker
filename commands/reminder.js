'use strict'

const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "reminder",
    aliases: ["remind", "remindme"],
    category: "User",
    description: "Remind you after a set time",
    usage: "<timeString> <message> [message link]"
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.user.reminder"],
    memberPermissions: ["command.user.reminder"]
});

// command.registerSubCommand() // remove reminder
// command.registerSubCommand() // edit reminder (time, message)

const timestring = require('timestring');
const ms = require("pretty-ms");

const msgRegex = /https?:\/\/(?:canary\.)?discord.com\/channels\/\d{18}\/\d{18}\/\d{18}/

command.setExecute(async(client, message, args, cmd) => {
    // check args
    if (!args || args.length < 2) {
        return message.channel.send("You must provide at least a timestring and a message");
    }
    let msFromNow;
    try {
        msFromNow = timestring(args.shift(), "ms");
    } catch (err) {
        return message.channel.send("This is not a valid timestring");
    }

    let reminderContent = args.join(" ");
    let msgUrl = message.url;

    const match = reminderContent.match(msgRegex);
    if (match) {
        msgUrl = match[0];
        reminderContent = reminderContent.replace(msgUrl, "");
    }

    const [numReminders] = await client.data.db.query("select count(ownerId) from reminders where ownerId=?", [message.author.id]);

    // check user has not passed any limits
    if (await client.premiumManager.userHasPremium(message.author.id)) {
        // number of active reminders
        if (numReminders >= client.config.reminder.premium.limit) {
            return message.channel.send(client.operations.generateEmbed.run({
                description: `You cannot make more than ${client.config.reminder.premium.limit} reminders`,
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
            }));
        }

        // time too long
        if (msFromNow > client.config.reminder.premium.maxTime) {
            return message.channel.send(client.operations.generateEmbed.run({
                description: `You cannot set reminders for later than ${ms(client.config.reminder.premium.maxTime)}`,
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
            }));
        }

        // time too short
        if (msFromNow < client.config.reminder.premium.minTime) {
            return message.channel.send(client.operations.generateEmbed.run({
                description: `You cannot set reminders for shorter than ${ms(client.config.reminder.premium.minTime)}`,
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
            }));
        }

        // message too long
        if (reminderContent.length > client.config.reminder.premium.maxLength) {
            return message.channel.send(client.operations.generateEmbed.run({
                description: `You cannot set reminders with message longer than ${client.config.reminder.premium.maxLength}`,
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
            }));
        }

        // message too short
        if (reminderContent.length < client.config.reminder.premium.minLength) {
            return message.channel.send(client.operations.generateEmbed.run({
                description: `You cannot set reminders with message shorter than ${client.config.reminder.premium.minLength}`,
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
            }));
        }

    } else {
        // number of active reminders
        if (numReminders >= client.config.reminder.limit) {
            return message.channel.send(client.operations.generateEmbed.run({
                title: `This is a premium feature!`,
                description: `You cannot make more than ${client.config.reminder.limit} reminders`,
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author, `${client.statics.defaultEmbed.footerSeparator} checkout premium and upgrade this to ${client.config.reminder.premium.limit}`)
            }));
        }

        // time too long
        if (msFromNow > client.config.reminder.maxTime) {
            return message.channel.send(client.operations.generateEmbed.run({
                title: `This is a premium feature!`,
                description: `You cannot set reminders for later than ${ms(client.config.reminder.maxTime)}`,
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author, `${client.statics.defaultEmbed.footerSeparator} checkout premium and upgrade this to ${ms(client.config.reminder.premium.maxTime)}`)
            }));
        }

        // time too short
        if (msFromNow < client.config.reminder.minTime) {
            return message.channel.send(client.operations.generateEmbed.run({
                title: `This is a premium feature!`,
                description: `You cannot set reminders for shorter than ${ms(client.config.reminder.minTime)}`,
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author, `${client.statics.defaultEmbed.footerSeparator} checkout premium and upgrade this to ${ms(client.config.reminder.premium.minTime)}`)
            }));
        }

        // message too long
        if (reminderContent.length > client.config.reminder.premium.maxLength) {
            return message.channel.send(client.operations.generateEmbed.run({
                title: `This is a premium feature!`,
                description: `You cannot set reminders with message longer than ${client.config.reminder.premium.maxLength}`,
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author, `${client.statics.defaultEmbed.footerSeparator} checkout premium and upgrade this to ${client.config.reminder.premium.maxLength}`)
            }));
        }

        // message too short
        if (reminderContent.length < client.config.reminder.premium.minLength) {
            return message.channel.send(client.operations.generateEmbed.run({
                title: `This is a premium feature!`,
                description: `You cannot set reminders with message shorter than ${client.config.reminder.premium.minLength}`,
                colour: client.statics.colours.tinker,
                ...client.statics.defaultEmbed.footerUser("Requested by", message.author, `${client.statics.defaultEmbed.footerSeparator} checkout premium and upgrade this to ${client.config.reminder.premium.minLength}`)
            }));
        }
    }

    // generate reminder
    const msg = await message.channel.send(client.operations.generateEmbed.run({
        description: `Remind you in \`${ms(msFromNow)}\` about \`${reminderContent}\`?`,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));


    await msg.react(client.emojiHelper.reactWith(client.data.emojis.ticks.greenTick));
    await msg.react(client.emojiHelper.reactWith(client.data.emojis.ticks.redCross));

    let collection;
    try {
        collection = await msg.awaitReactions((reaction, user) => {
            return [client.emojiHelper.getName(client.data.emojis.ticks.greenTick),
                client.emojiHelper.getName(client.data.emojis.ticks.redCross)
            ].includes(reaction.emoji.name) && user.id === message.author.id
        }, { max: 1, time: 30000, errors: ['time'] });
    } catch (e) {
        console.log(e)
        if (await client.permissionsManager.botHasIn(message.guild, message.channel, "MANAGE_MESSAGES")) { msg.reactions.removeAll(); }
        msg.edit(client.operations.generateEmbed.run({
            title: `Reminder cancelled`,
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
        }));
        return;
    }

    let reaction = collection.first();
    if (await client.permissionsManager.botHasIn(message.guild, message.channel, "MANAGE_MESSAGES")) { msg.reactions.removeAll(); }
    if (reaction.emoji.name === client.emojiHelper.getName(client.data.emojis.ticks.redCross)) {
        msg.edit(client.operations.generateEmbed.run({
            title: `Reminder cancelled`,
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
        }));
        return;
    }

    msg.edit(client.operations.generateEmbed.run({
        title: `You will be reminded in ${ms(msFromNow)} from now`,
        description: `Saving to DB ${client.emojiHelper.sendWith(client.data.emojis.custom.loading)}`,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));

    // add to db
    const id = client.utility.createUUID("rmd-*x*x*x-*x*x*x");
    let revealTime = new Date().getTime() + msFromNow;
    await client.data.db.query("insert into reminders(id, content, revealTime, messageUrl, ownerId) values(?, ?, ?, ?, ?)", [id, reminderContent, client.timeManager.timeToSqlDateTime(revealTime), msgUrl, message.author.id]);


    msg.edit(client.operations.generateEmbed.run({
        title: `You will be reminded in ${ms(msFromNow)} from now`,
        description: `Saved to DB ${client.emojiHelper.sendWith(client.data.emojis.ticks.greenTick)}`,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, `${client.statics.defaultEmbed.footerSeparator} ${id} ${client.statics.defaultEmbed.footerSeparator} Make sure you are accepting DMs from the bot!`)
    }));
});

module.exports = command;