const randomPuppy = require('random-puppy');
const setResponses = require("../../res/setResponse")
const logger = require("../../lib/logger")
let reddit = [
    "meme",
    "dankmemes",
    "dankmeme",
    "wholesomememes",
    "MemeEconomy",
    "techsupportanimals",
    "meirl",
    "me_irl",
    "2meirl4meirl",
    "AdviceAnimals"
]

module.exports.run = async (bot, message, args) => {

    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];

    message.channel.startTyping();

    randomPuppy(subreddit).then(async url => {
            await message.channel.send({
                files: [{
                    attachment: url,
                    name: 'meme.png'
                }]
            }).then(() => message.channel.stopTyping());
    }).catch(err => {
        logger.log("error", err.stack)
        message.channel.stopTyping();
        message.channel.send(setResponses.httpGetError("api-iKe-b4H-f8a"))
    });

};

module.exports.help = {
    name: 'meme',
    aliases: ['memes'],
    description: `Sends you a random meme from these sub-reddits: ${reddit.join(", ")}. We cannot be held responsible for any content that comes from an external site`,
    cooldown: 3
}