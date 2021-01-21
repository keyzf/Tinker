const { bot } = require('../../index');
const stringSimilarity = require("string-similarity");
const deleteCatch = require("../../util/deleteCatch");

const spamTimeoutMS = 3000;

module.exports.run = async (message, dbGuild) => {

    return;
    // TODO: This is severely broken
    var channels = dbGuild.ignoredSpamChannels;
    if (channels) if (channels.some(v => message.channel.id == v)) return;
    
    bot.recentMessages = bot.recentMessages.filter(elt => elt.timestamp+spamTimeoutMS > message.createdTimestamp);

    let messages = bot.recentMessages.filter(elt => elt.authorId == message.author.id);

    messages.forEach((elt) => {
        if (stringSimilarity.compareTwoStrings(message.content, elt.content) > 0.8) {
            message.reply("You have sent a similar message. Please avoid repeating yourself often or spamming")
                .then((m) => deleteCatch(m, 3000));
            deleteCatch(message)
            return;
        }
    });

    bot.recentMessages.push({ content: message.content, authorId: message.author.id, timestamp: message.createdTimestamp });
}

module.exports.help = {
    name: "messageSpamCheck"
}