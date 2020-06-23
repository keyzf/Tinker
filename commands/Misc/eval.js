const safeEval = require("notevil");

module.exports.run = async (bot, message, args) => {
    try {
        var output = [];
        const data = await safeEval(args.join(" "), 
        {
            console: {
                log: function(input){output.push(input)}
            }
        });
        message.channel.send(`logs ${output.join(", ")}`)
        return message.channel.send(`${message.author} your code finished:\n\`${data}\``);
    } catch (err) {
        return message.channel.send(`${message.author} your code finished with error:\n\`${err}\``);
    }

};

module.exports.help = {
    name: 'eval',
    aliases: ["evaluate"],
    description: "Evaluate using javascript",
    usage: "[js code]",
    cooldown: 5
};
