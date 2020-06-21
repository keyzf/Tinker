const { bot } = require('../bot');
// const logger = require("../lib/logger");
const stringSimilarity = require("string-similarity");

bot.on("messageSpamCheck", async (message, dbGuild) => {

    // checks this isn't similar to a recently sent message (returns after warn message)
    let messages = bot.recentMessages.filter(elt => elt.authorId == message.author.id);
    var stop;
    messages.forEach((elt) => {
        if (stringSimilarity.compareTwoStrings(message.content, elt.content) > 0.8) {
            stop = true
            message.reply("Hey this is kinda similar to a recent message. Please avoid repeating yourself often or spamming")
                .then((m) => m.delete( {timeout: 5000 }));
            message.delete({ timeout: 0 });
            return;
        }
    });
    if (stop) return

    bot.recentMessages.push({ content: message.content, authorId: message.author.id });
    setTimeout(() => bot.recentMessages = bot.recentMessages.filter((elt) => elt.authorId == message.author.id && elt.content == message.content), 10000);
});