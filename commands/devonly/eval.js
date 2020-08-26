const Discord = require("discord.js");
const { db, Fields } = require("../../lib/db");
const logger = require("../../lib/logger");
const config = require("../../config/config.json");
const { devs } = require("../../config/devs.json");
const { codes } = require("../../config/errorCodes.json");
const swears = require("../../res/swearlist.json").swears;

module.exports.run = async(bot, message, args, dbGuild, cmd) => {

    function send(data) {
        message.channel.send(data)
    }

    var code = message.content.slice(dbGuild.prefix.length + cmd.length).trim().replace(/```/g, "").replace("js", "");
    try {
        const data = await eval(code);
        return message.channel.send(`${message.author} your code finished:\nReturn data: \`${data}\``);
    } catch (err) {
        return message.channel.send(`${message.author} your code finished with error:\n\`${err}\``);
    }

};

function send(data) {
    message.channel.send(data)
}

module.exports.help = {
    name: 'eval',
    aliases: ["evaluate"],
    description: "Evaluate using javascript",
    usage: "[js code]",
    cooldown: 5,
    limit: true
};