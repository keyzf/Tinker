const Discord = require("discord.js");
const setResponses = require("../../res/setResponse")

module.exports.run = async (bot, message, args, dbGuild) => {
    
    return message.channel.send(setResponses.inDev())
};

module.exports.help = {
    name: 'error',
    aliases: [],
    description: "Sends information about the error",
    usage: "[error code]",
    cooldown: 5,
    generated: true
};