const stringSimilarity = require("string-similarity");
const emojis = require("../../data/emoji_list.json");
const deleteCatch = require("../../util/deleteCatch");
const logger = require("../../lib/logger");

module.exports.run = async(bot, message, args, dbGuild, command) => {
    const cmds = bot.commands.map((cmd) => {
        return (cmd.help.name);
    });
    const aliases = Array.from(bot.aliases.keys());
    const all = cmds.concat(aliases)

    const matches = stringSimilarity.findBestMatch(command, all);

    if (matches.bestMatch.rating < 0.3) {
        message.react("🤦‍♂️")
        message.channel.send(`Need a hand? Type \`${dbGuild.prefix}help\``)
            .then((msg) => {
                deleteCatch(msg, 5000);
            });
        return;
    }

    const bestMatch = matches.bestMatch.target;
    const msg = await message.channel.send(`Did you mean \`${bestMatch}\`?`);

    await msg.react(emojis.symbols.white_check_mark);
    await msg.react(emojis.symbols.x);

    const filter = (reaction, user) => [emojis.symbols.white_check_mark, emojis.symbols.x].includes(reaction.emoji.name) && user.id === message.author.id;

    // use to collect a fixed number of reactions and deal with them once that limit is reached (or timeout is reached)
    msg.awaitReactions(filter, { max: 1, time: 5000, errors: ['time'] })
        .then((collection) => {
            let reaction = collection.first();
            // remove the existing reactions
            msg.reactions.removeAll().then(async() => {
                if (reaction.emoji.name === emojis.symbols.white_check_mark) {
                    let command;
                    if (bot.commands.has(bestMatch)) {
                        command = bot.commands.get(bestMatch);
                    } else {
                        command = bot.commands.get(bot.aliases.get(bestMatch));
                    }

                    try {
                        await command.run(bot, message, args, dbGuild, command);
                    } catch (err) {
                        logger.error(err.stack)
                        const e = await bot.cevents.get("generateError").run(err, "This is what I get for suggesting a command correction. I know nothing!");
                        message.channel.send(e);
                    }
                }
                deleteCatch(msg, 0);
            });
        })
        .catch(collected => {
            deleteCatch(msg, 0)
        });
}

module.exports.help = {
    name: "guessCommand"
}