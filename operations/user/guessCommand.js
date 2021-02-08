const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "guessCommand"
});

op.setPerms({
    botPermissions: ["ADD_REACTIONS", "MANAGE_MESSAGES"]
})

const stringSimilarity = require("string-similarity");

op.setExecute(async(client, message, args, cmd) => {
    if(!op.checkPerms(message.guild, message.channel)) {return}

    const cmds = client.commands.map((c) => {
        return (c.info.name);
    });
    const aliases = Array.from(client.aliases.keys());
    const all = cmds.concat(aliases)

    const matches = stringSimilarity.findBestMatch(cmd, all);

    if (matches.bestMatch.rating < 0.3) {
        const {prefix} = client.data.db.prepare(`SELECT prefix FROM guilds WHERE guildID=?`).get(message.guild.id);
        message.react("🤦‍♂️")
        message.channel.send(`Need a hand? Type \`${prefix}help\``)
            .then((msg) => {
                client.operations.get("deleteCatch")(msg, 5000);
            });
        return;
    }

    const bestMatch = matches.bestMatch.target;
    const msg = await message.channel.send(`Did you mean \`${bestMatch}\`?`);

    await msg.react(client.data.emojis.symbols.white_check_mark);
    await msg.react(client.data.emojis.symbols.x);

    const filter = (reaction, user) => [client.data.emojis.symbols.white_check_mark, client.data.emojis.symbols.x].includes(reaction.emoji.name) && user.id === message.author.id;

    // use to collect a fixed number of reactions and deal with them once that limit is reached (or timeout is reached)
    msg.awaitReactions(filter, { max: 1, time: 5000, errors: ['time'] })
        .then((collection) => {
            let reaction = collection.first();
            // remove the existing reactions
            msg.reactions.removeAll().then(async() => {
                if (reaction.emoji.name === client.data.emojis.symbols.white_check_mark) {
                    let command;
                    if (client.commands.has(bestMatch)) {
                        command = client.commands.get(bestMatch);
                    } else {
                        command = client.commands.get(client.aliases.get(bestMatch));
                    }

                    try {
                        await command.run(message, args, command);
                    } catch (err) {
                        client.logger.error(err.stack)
                        const e = await client.operations.get("generateError")(err, "This is what I get for suggesting a command correction. I know nothing!");
                        message.channel.send(e);
                    }
                }
                client.operations.get("deleteCatch")(msg, 0);
            });
        })
        .catch(() => {
            client.operations.get("deleteCatch")(msg, 0)
        });
});

module.exports = op;
