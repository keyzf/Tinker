const fetch = require("node-fetch");
const logger = require("../../lib/logger")
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    message.channel.startTyping();

    fetch('https://raw.githubusercontent.com/LordFarquhar/DnDGang/master/quotes.json')
        .then(async (response) => {
            let content = await response.json()
            const quotes = content.quotes;

            var item;
            var num;
            if (args[0]){
                var items = quotes.filter((elt) => {
                    return elt.by.toLowerCase()== args[0].toLowerCase();
                })
                if(!items.length) return message.channel.send("Could not get quote with that name");
                num = Math.floor(Math.random() * items.length)
                item = items[num];
            } else {
                num = Math.floor(Math.random() * quotes.length);
                var item = quotes[num];
            }

            const embed = new Discord.MessageEmbed();
            embed.setTitle(`${(item.pg) ? "SFW" : "NSFW"} DnD Quote`)
            embed.addFields(
                { name: `${item.by.charAt(0).toUpperCase() + item.by.slice(1)}`, value: `${item.quote}` },
                { name: `Date`, value: `${item.date}` }
                )
            embed.setFooter(`Quote no. ${num+1}`)
            message.channel.send(embed)
        })
        .catch((err) => {
            logger.log("warn", `error on meme fetch: ${err.stack}`)
            message.channel.send("Could not get quote");
        });

    message.channel.stopTyping();

};

module.exports.help = {
    name: 'quote',
    aliases: ['quotes'],
    description: "Sends you a random quote from my DnD campaigns!"
}