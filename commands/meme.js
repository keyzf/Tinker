const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "meme",
    aliases: [],
    category: "Fun",
    description: "Gets a random meme from reddit",
    usage: ""
});

cmd.setLimits({
    cooldown: 1,
    limited: false
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

const fetch = require("node-fetch")
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
const { MessageEmbed } = require("discord.js");

cmd.setExecute(async(client, message, args, cmd) => {
    message.channel.startTyping();

    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];

    fetch(url + subreddit + urlEnd)
        .then((res) => res.json())
        .then((response) => {
            let index = Math.floor(Math.random() * 100);
            let post = response.data.children[index].data;
            imageEmbed = new MessageEmbed()
                .setTitle(post.title)
                .setURL("https://reddit.com" + post.permalink)
                .setDescription(`u/${post.author}`)
                .setFooter(`r/${subreddit}`)
                .setImage(post.url);
            message.channel.send(imageEmbed);
            message.channel.stopTyping();
        })
        .catch(async({stack}) => {
            client.logger.error(stack, { channel: message.channel, content: message.content, origin: __filename });
            message.channel.stopTyping();
            return await message.channel.send(await client.operations.generateError.run(stack, "Failed to get meme from reddit", { channel: message.channel, content: message.content, origin: __filename }));
        });
});

module.exports = cmd;