const Discord = require("discord.js");
const { db, Fields } = require("../../lib/db");
const logger = require("../../lib/logger");
const config = require("../../config/config.json");
const { devs } = require("../../config/devs.json");
const generateDefaultEmbed = require("../../util/generateDefaultEmbed");
const util = require("util");
const { v4: uuidv4 } = require("uuid");
const figlet = require('figlet');

module.exports.run = async(bot, message, args, dbGuild, cmd) => {

    function send(data) {
        message.channel.send(data)
    }

    function showAll(data) {
        return util.inspect(data, {showHidden: false, depth: null})
    }

    function asciiImagetext(text) {
        return "```" + figlet.textSync(text, { horizontalLayout: 'full' }) + "```";
    }

    var code = message.content.slice(dbGuild.prefix.length + cmd.length).trim()
    if (code.indexOf("```") == 0){
        code = code.replace(/```/g, "").replace("js", "");
    }
    try {
        const data = await eval(code);
        if (data) {
            message.channel.send(`Return data: \`${data}\``);
        }
    } catch (err) {
        message.channel.send(`Error:\`${err}\``);
    }

};

module.exports.help = {
    name: 'eval',
    aliases: ["evaluate"],
    description: "Evaluate using javascript",
    usage: "[js code]",
    cooldown: 5,
    limit: true
};