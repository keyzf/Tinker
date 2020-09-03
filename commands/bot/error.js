const Discord = require("discord.js");
const setResponses = require("../../res/setResponse")

module.exports.run = async (bot, message, args, dbGuild) => {
    message.channel.send("after");
};

module.exports.help = {
    name: 'error',
    aliases: [],
    description: "Sends information about the error",
    usage: "[error code]",
    cooldown: 5,
    generated: true,
    inDev: true
};