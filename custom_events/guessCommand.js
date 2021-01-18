const stringSimilarity = require("string-similarity");
const emojis = require("../data/emoji_list.json");
const deleteCatch = require("../util/deleteCatch");

module.exports.run = async(bot, message, args, dbGuild, command) => {
    const cmds = bot.commands.map((cmd) => {
        return (cmd.help.name);
    });

    const matches = stringSimilarity.findBestMatch(command, cmds);

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
                    bot.commands.get(bestMatch).run(bot, message, args, dbGuild, command);
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