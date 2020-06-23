const safeEval = require("notevil");

module.exports.run = async (bot, message, args) => {
    try {
        const data = safeEval(args.join(" "));
        return message.channel.send(`${message.author} your code finised:\n\`${data}\``);
    } catch (err) {
        return message.channel.send(`${message.author} your code finised with error:\n\`${err}\``);
    }

};

module.exports.help = {
    name: 'eval',
    aliases: ["evaluate"],
    description: "Evaluate using javascript",
    usage: "[js code]",
    cooldown: 5
};
