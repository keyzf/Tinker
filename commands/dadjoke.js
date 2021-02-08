const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "dadjoke",
    aliases: [],
    category: "Fun",
    description: "Get a good 'ol dad joke",
    usage: "[joke ID]"
});

cmd.setLimits({
    cooldown: 0,
    limited: false
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

const axios = require("axios");
const { MessageEmbed } = require("discord.js");

cmd.setExecute(async(client, message, args, cmd) => {
    message.channel.startTyping();

    if (args[0]) {
        axios({
                method: "get",
                url: `https://icanhazdadjoke.com/j/${args[0]}`,
                headers: { accept: "application/json" }
            })
            .then(({data}) => {
                if (data.status != 200) {
                    message.channel.send(data.message)
                    return message.channel.stopTyping();
                }
                const embed = new MessageEmbed();
                embed.setDescription(data.joke)
                embed.setFooter(`Joke id: ${data.id}`)
                message.channel.send(embed)
            })
            .catch(async(err) => {
                message.channel.stopTyping();
                return await message.channel.send(await client.operations.get("generateError")(err, "Error getting dad joke", { channel: message.channel, content: message.content }));
            });
    } else {
        axios({
                method: "get",
                url: `https://icanhazdadjoke.com/`,
                headers: { accept: "application/json" }
            })
            .then(({data}) => {
                if (data.status != 200) {
                    message.channel.send(data.message)
                    return message.channel.stopTyping();
                }
                const embed = new MessageEmbed();
                embed.setDescription(data.joke)
                embed.setFooter(`Joke id: ${data.id}`)
                message.channel.send(embed)
            })
            .catch(async(err) => {
                return await message.channel.send(await client.operations.get("generateError")(err, "Error getting dad joke", { channel: message.channel, content: message.content }));
            });
    }
    message.channel.stopTyping();
});

module.exports = cmd;