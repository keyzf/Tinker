const fetch = require("node-fetch");
const logger = require("../../lib/logger")
const Discord = require("discord.js");
const { quotesdb } = require("../../lib/db")

module.exports.run = async(bot, message, args) => {

    // quotesdb.findOne({ email: passed_email }).then((elt) => found(elt))

    message.channel.startTyping();

    let all;
    if (args[0]) {
        if (args[0].toLowerCase() == "nsfw") {
            all = await quotesdb.find({ pg: false });
        } else if (args[0].toLowerCase() == "sfw") {
            all = await quotesdb.find({ pg: true });
        } else {
            all = await quotesdb.find({ by: args[0].toLowerCase() });
        }
    } else {
        all = await quotesdb.find({});
    }

    const item = all[Math.floor(Math.random() * all.length)];

    if (item) {

        const embed = new Discord.MessageEmbed();
        embed.setTitle(`${(item.pg) ? "SFW" : "NSFW"} DnD Quote`)
        embed.addFields({ name: `${item.by.charAt(0).toUpperCase() + item.by.slice(1)}`, value: `${item.quote}` }, { name: `Date`, value: `${item.date}` })
        embed.setFooter(`Quote id. ${item._id}`)
        message.channel.send(embed)
    } else {
        message.channel.send("Quote could not be found");
    }
    message.channel.stopTyping();
};

module.exports.help = {
    name: 'quote',
    aliases: ['quotes'],
    description: "Sends you a quote from my friends (usually my DnD campagin)!",
    generated: true
}