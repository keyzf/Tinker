const fetch = require("node-fetch");
const logger = require("../../lib/logger")
const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {

    message.channel.startTyping();

    if (args[0]) {
        fetch(`https://icanhazdadjoke.com/j/${args[0]}`, {
                headers: { 'Accept': 'application/json' }
            })
            .then((response) => response.json())
            .then((json) => {
                if (json.status != 200) {
                    message.channel.send(json.message)
                    return message.channel.stopTyping();
                }
                console.log(json)
                const embed = new Discord.MessageEmbed();
                embed.setDescription(json.joke)
                embed.setFooter(`Joke id: ${json.id}`)
                message.channel.send(embed)
            })
            .catch(async (err) => {
                logger.error(e, { channel: message.channel, content: message.content });
                message.channel.stopTyping();
                return await message.channel.send(await bot.shardFunctions.get("generateError").run(e, "Error getting dad joke"));
            });
    } else {
        fetch('https://icanhazdadjoke.com/', {
                headers: { 'Accept': 'application/json' }
            })
            .then((response) => response.json())
            .then((json) => {
                const embed = new Discord.MessageEmbed();
                embed.setDescription(json.joke)
                embed.setFooter(`Joke id: ${json.id}`)
                message.channel.send(embed)
            })
            .catch(async (err) => {
                logger.error(e, { channel: message.channel, content: message.content });
                return await message.channel.send(await bot.shardFunctions.get("generateError").run(e, "Error getting dad joke"));
            });
    }
    message.channel.stopTyping();

};

module.exports.help = {
    name: 'dadjoke',
    aliases: ['dadjokes'],
    description: "Sends you a random dad joke from icanhazdadjoke.com",
    generated: true
}