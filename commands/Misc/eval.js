const saveEval = require("notevil");

module.exports.run = async (bot, message, args) => {
    const data = safeEval(args.join(" "))
    return message.channel.send(`${message.author} your code finised:\n\`${data}\``);

};

module.exports.help = {
    name: 'eval',
    aliases: [],
    description: "Evaluate using javascript",
    usage: "[js code]",
    cooldown: 5
};
