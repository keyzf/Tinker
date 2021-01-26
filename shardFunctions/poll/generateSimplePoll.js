const generateDefaultEmbed = require("../../util/generateDefaultEmbed");

module.exports.run = async (bot, channel, question, author) => {
    const msg = await channel.send(generateDefaultEmbed({
        title: "Poll",
        description: question,
        footerText: `Poll made by ${author.tag}`,
        footerUrl: author.displayAvatarURL()
    }));

    await msg.react("👍");
    await msg.react("👎");
    
    return msg;
}

module.exports.help = {
    name: "generateSimplePoll"
}