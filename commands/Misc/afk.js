const generateDefaultEmbed = require("../../util/generateDefaultEmbed");
const deleteCatch = require("../../util/deleteCatch")

module.exports.run = async (bot, message, args) => {

    let reason = args.join(' ') ? args.join(' ') : 'I am currently afk, I will reply as soon possible.';
    let afklist = bot.afk.get(message.author.id);

    if (!afklist) {
        let construct = {
            id: message.author.id,
            usertag: message.author.tag,
            reason: reason
        };

        bot.afk.set(message.author.id, construct);
        message.channel.send(generateDefaultEmbed({description: `you have been set to afk for reason: ${reason}`})).then(msg => deleteCatch(msg, 5000));
    }

};

module.exports.help = {
    name: 'afk',
    aliases: [],
    description: "Allows you to set yourself into afk. If anyone pings you it tells them the reason you specified why you were afk",
    usage: "[reason]",
    cooldown: 3
};