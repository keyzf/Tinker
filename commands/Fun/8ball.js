const responses = require("../../data/8ball.json");
const generateDefaultEmbed = require('../../util/generateDefaultEmbed');

module.exports.run = async(bot, message, args) => {
    let question = args.join(" ")
    if (!question) { return message.channel.send(`You did not specify your question!`); }
    if (question.length > 1800) { return message.channel.send("Ask a slightly smaller question") } 
    else {
        let response = responses[Math.floor(Math.random() * responses.length - 1)];
        message.channel.send(generateDefaultEmbed({
            title: "8 Ball",
            description: `You asked: ${question}\nMy reply: ${response}`
        }));
    }

}
module.exports.help = {
    name: "8ball",
    aliases: ["randomball"],
    description: "adk 8 ball",
    usage: "your question",
    cooldown: 1,
    inDev: false,
    generated: true
};