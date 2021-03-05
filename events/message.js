const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "message"
});

event.setExecute(async(client, message) => {
    // if the message sent was from a client then completely ignore it (return)
    if (message.author.bot) {
        return;
    }
    // if the message was sent to the client through a dm (direct message) send a response to head to the server
    if (message.channel.type === "dm") {
        client.operations.dmConversation.run(message)
        return;
    }

    if(message.channel.id == client.config.officialServer.lounge_text) { await client.operations.wanderingWorker.run() }

    // find the guild from the database using its id (obtained from the sent message)
    const dbGuild = client.data.db.prepare(`Select prefix, guildID FROM guilds WHERE guildID='${message.guild.id}'`).get();
    if (!dbGuild) {
        client.emit("guildCreate", message.guild);
        return;
    }

    // get the desired prefix for this guild
    const prefix = dbGuild.prefix;

    // check if a user was mentioned and get the first one
    if (message.mentions.users && !message.mentions.everyone) {
        // for every mentioned user
        message.mentions.users.array().forEach((user) => {
            // check the mentioned user is afk
            const mentioned = client.afk.get(user.id);
            // if they are then tell the channel that the user is afk and for the reason the user set
            if (mentioned) {
                message.channel.send(client.operations.generateEmbed.run({ description: `**${mentioned.usertag}** is currently afk. Reason: ${mentioned.reason}` }))
                    .then((msg) => client.operations.deleteCatch.run(msg, 5000));
            }
        });
    }

    // check if the user that sent a message is afk
    const afkcheck = client.afk.get(message.author.id);
    // if so remove them from the afk list as they have sent a message and are no longer afk
    if (afkcheck) {
        client.afk.delete(message.author.id);
        message.channel.send(
                client.operations.generateEmbed.run({ description: `you have been removed from the afk list!` }))
            .then(msg => client.operations.deleteCatch.run(msg, 5000));
    }

    const user = client.data.db.prepare(`Select * FROM users WHERE guildID='${dbGuild.guildID}' AND userID=${message.author.id}`).get();
    const globalUser = client.data.db.prepare(`Select * FROM globalUser WHERE userID=${message.author.id}`).get();
    if (!user) { return client.operations.addUser.run(message.author.id, message.guild.id) }

    // if the message isn't a command then:
    if (!message.content.startsWith(prefix)) {

        user.messagesSent += 1;

        client.data.db.prepare(`
            UPDATE users
            SET messagesSent='${user.messagesSent}'
            WHERE guildID='${dbGuild.guildID}' AND userID='${user.userID}';
        `).run();

        if (message.mentions.has(client.user) && !message.mentions.everyone && message.type == "DEFAULT") {
            message.channel.send(`The prefix for this guild is \`${prefix}\``).then((m) => m.delete({ timeout: 5000 }));
        }

        if (dbGuild.profanityFilter) {
            const prof = await client.operations.messageProfanityCheck.run(message, dbGuild);
            if (prof) {
                await message.delete({ timeout: 0 })
                message.channel.send(`${message.author} said: "${prof}"`)
            }
        }
        if (dbGuild.preventSpam) { await client.operations.messageSpamCheck.run(message, dbGuild); }

        return;
    }

    if (!globalUser) {
        message.channel.send(client.operations.generateEmbed.run({
            title: "First Time?",
            description: `Looks like this is your first time with me, Tinker! I have loads of helpful, fun and cool commands. Start out by running \`${prefix}help\` in a suitable channel`,
            colour: client.statics.colours.tinker
        })).then((m) => client.operations.deleteCatch.run(m, 20000))

        await client.operations.addGlobalUser.run(message.author.id);
    }

    // split the rest of the sentence by each word (SPACE) or "many worded args"
    const input = message.content.slice(prefix.length).trim();
    const args = [];
    const preArgs = input.match(/"[^"]+"|[\S]+/g)
    if (!preArgs) {
        message.react("👋");
        return;
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
    if (client.commands.has(cmd)) {
        command = client.commands.get(cmd);
    } else {
        // or any aliases there are
        command = client.commands.get(client.aliases.get(cmd));
    }

    // if the command was found (or any of its aliases)
    if (command) {

        // check if dev only command
        if (command.limits.limited && !client.config.devs.includes(message.author.id)) {
            if (command.limits.limitMessage) {
                message.channel.send(client.operations.generateEmbed.run({ description: command.limits.limitMessage }));
                return;
            }
            message.channel.send(client.operations.generateEmbed.run({
                title: "Sorry, not for you",
                description: "This is a developer only command \nOur dev team leave commands in the client to allow for easier testing and faster fixes, just for you!\nThese commands don't show up in the help tab and can only be accessed by our devs so you don't need to worry about them",
                fields: [
                    { name: "Something wrong?", value: "If you think this is a mistake you can get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP)" }
                ]
            }));
            return;
        }
        // check if in dev command
        if (command.limits.inDev && !client.config.devs.includes(message.author.id)) {
            if (command.limits.inDevMessage) {
                message.channel.send(client.operations.generateEmbed.run(command.limits.inDevMessage));
                return;
            }
            message.channel.send(client.operations.generateEmbed.run({
                title: "This is in development",
                description: "This command is in development and cannot currently be used in this server\nWe are constantly adding features and improving current ones. But the way we work is that the client should be available to everyone with as little downtime as possible. This means that sometimes a feature has to be taken offline to be improved / fixed but the client is still running just for you.\nIf your lucky this could be a new feature that is almost ready for release!\nThese commands don't show up in the help tab and can only be accessed by our devs so you don't need to worry about them",
                fields: [
                    { name: "Something wrong?", value: "If you think this is a mistake you can get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP)" }
                ]
            }));
            return;
        }

        // run the command
        try {
            await command.run(message, args, cmd);
        } catch ({stack}) {
            client.logger.critical(stack, { channel: message.channel, content: message.content, origin: "events/message.js" })
            const e = await client.operations.generateError.run(stack, "It was a biiiggg error, cause it got all the way here in the code", { channel: message.channel, content: message.content });
            message.channel.send(e)
        }

        // message.delete({ timeout: 8000 });
    } else {
        // this code runs if the command was not found (the user used the client prefix and then an invalid command)
        client.operations.guessCommand.run(message, args, cmd);
    }
    return;
});


module.exports = event;