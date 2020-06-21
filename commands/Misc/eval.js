const saveEval = require("notevil");

module.exports.run = async (bot, message, args) => {
    
    safeEval(args.join(" "))

};

module.exports.help = {
    name: 'eval',
    aliases: [],
    description: "Evaluate using javascript",
    usage: "[js code]",
    cooldown: 5
};