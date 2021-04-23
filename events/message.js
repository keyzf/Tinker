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

    // TODO: blacklisting or something idk
    const globalUserPermissions = await client.permissionsManager.getGlobalBotUserPerms(message.author);
    // if (!globalUserPermissions.has("event.message")) {
    //     return client.logger.debug(`Global User is blacklisted from message event, User: ${message.author.tag} (${message.author.id})`)
    // }

    // if the message was sent to the client through a dm (direct message) send a response to head to the server
    if (message.channel.type === "dm") {
        if (globalUserPermissions.has("dm.conversation")) {
            client.operations.dmConversation.run(message);
        }
        return;
    }

    if (message.channel.id === client.config.officialServer.lounge_text) {
        await client.operations.wanderingWorker.run()
    }

    // find the guild from the database using its id (obtained from the sent message)
    const [guild] = await client.data.db.query(`select prefix from guilds where guildID='${message.guild.id}'`);

    if (!guild) {
        client.emit("guildCreate", message.guild);
        return;
    }
    const prefix = guild.prefix;

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

    const [user] = await client.data.db.query(`select * from users where guildID='${message.guild.id}' and userID='${message.author.id}'`);

    const [globalUser] = await client.data.db.query(`select * from globalUser where userID='${message.author.id}'`);

    if (!user) {
        return client.operations.addUser.run(message.author.id, message.guild.id)
    }

    // if the message isn't a command then:
    if (!message.content.startsWith(prefix)) {

        user.messagesSent += 1;

        await client.data.db.query(`update users set messagesSent='${user.messagesSent}' where guildID='${message.guild.id}' and userID='${message.author.id}'`);

        if (message.mentions.has(client.user) && !message.mentions.everyone && message.type === "DEFAULT") {
            message.channel.send(`The prefix for this guild is \`${prefix}\``).then((m) => client.operations.deleteCatch.run(m, 5000));
        }

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

        // run the command
        try {
            await command.run(message, args, cmd);
        } catch (err) {
            // console.log(err)
            client.logger.critical(err.stack, {
                channel: message.channel,
                content: message.content,
                origin: "events/message.js"
            })
            const e = await client.operations.generateError.run(err.stack, "It was a biiiggg error, cause it got all the way here in the code", {
                channel: message.channel,
                content: message.content
            });
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