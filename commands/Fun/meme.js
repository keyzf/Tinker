const fetch = require("node-fetch");
const setResponses = require("../../data/setResponse");
const logger = require("../../lib/logger");
const reddit = [
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
];
const url = `https://www.reddit.com/r/`;
const urlEnd = `.json?limit=100`;
const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    message.channel.startTyping();

    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];

    fetch(url+subreddit+urlEnd)
        .then((res) => res.json())
        .then((response) => {
                let index = Math.floor(Math.random() * 100);
                let post = response.data.children[index].data;
                imageEmbed = new Discord.MessageEmbed()
                    .setTitle(post.title)
                    .setURL("https://reddit.com" + post.permalink)
                    // .setColor(config.embedColour)
                    .setDescription(`u/${post.author}`)
                    .setFooter(`r/${subreddit}`)
                    .setImage(post.url);
                message.channel.send(imageEmbed);
                message.channel.stopTyping();
            }
        )
        .catch((err) => {
            message.channel.send(setResponses.httpGetError(""))
            message.channel.stopTyping();
        });


};

module.exports.help = {
    name: 'meme',
    aliases: ['memes'],
    description: `Sends you a random meme from these sub-reddits: ${reddit.join(", ")}. Please also see \`help disclaimer\``,
    cooldown: 3,
    generated: true
}