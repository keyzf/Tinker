'use strict'

const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "dadjoke",
    aliases: [],
    category: "Fun",
    description: "Get a good 'ol dad joke",
    usage: "[joke ID]"
});

command.setLimits({
    cooldown: 3
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.fun.dadjoke"],
    memberPermissions: ["command.fun.dadjoke"]
});

const axios = require("axios");
const { MessageEmbed } = require("discord.js");

command.setExecute(async(client, message, args, cmd) => {
    message.channel.startTyping();

    if (args[0]) {
        axios({
                method: "get",
                url: `https://icanhazdadjoke.com/j/${args[0]}`,
                headers: { accept: "application/json" }
            })
            .then(({ data }) => {
                if (data.status != 200) {
                    message.channel.send(data.message)
                    return message.channel.stopTyping();
                }
                const embed = new MessageEmbed();
                embed.setDescription(data.joke)
                embed.setFooter(`Joke id: ${data.id}`)
                embed.setColor(client.statics.colours.tinker)
            })
            .catch(async({stack}) => {
                message.channel.stopTyping();
                return await message.channel.send(await client.operations.generateError.run(stack, "Error getting dad joke", { channel: message.channel, content: message.content, origin: __filename }));
            });
    } else {
        axios({
                method: "get",
                url: `https://icanhazdadjoke.com/`,
                headers: { accept: "application/json" }
            })
            .then(({ data }) => {
                if (data.status != 200) {
                    message.channel.send(data.message)
                    return message.channel.stopTyping();
                }
                const embed = new MessageEmbed();
                embed.setDescription(data.joke)
                embed.setFooter(`Joke id: ${data.id}`)
                embed.setColor(client.statics.colours.tinker)
                message.channel.send(embed)
            })
            .catch(async({stack}) => {
                return await message.channel.send(await client.operations.generateError.run(stack, "Error getting dad joke", { channel: message.channel, content: message.content, origin: __filename }));
            });
    }
    message.channel.stopTyping();
});

module.exports = command;