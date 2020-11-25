const setResponses = require("../../res/setResponse")

module.exports.run = async (bot, message, args) => {
    // TODO: Bad Suggestions #1: some kind of!roulette function where you get different functions that change randomly. !russianroulette gives you a one in six chance of being kicked from the sever
    
}
module.exports.help = {
    name: "roulette",
    aliases: ["chance"],
    description: "Does something random",
    cooldown: 10,
    inDev: true
};
