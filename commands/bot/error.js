const Discord = require("discord.js");
const setResponses = require("../../res/setResponse");
const errorCodes = require("../../config/errorCodes.json").codes;

module.exports.run = async(bot, message, args, dbGuild) => {
    if (!args[0]) { return message.channel.send("Please provide an error code"); }

    const e = new Discord.MessageEmbed()
    .setTitle(`Error Code ${args[0]}`)
    .setColor("#a700bd")
    
    .setTimestamp();

    const found = errorCodes.filter((elt) => {
        return elt.code == args[0]
    });
    if (found.length > 1) { e.setDescription("There is and issue with the error code lookup file. Please contact a developer immeditately") }
    else if (!found.length) { e.setDescription("Could not find error with that code") }
    else if (!found[0].userMsg) { e.setDescription("No error message is associated with that code") }
    else { 
        e.setDescription(found[0].name)
        e.addFields(
            { name: "User Message", value: `${found[0].userMsg}` },
            { name: "Dev Message", value: `${found[0].devMsg}` }
        );
    }
    message.channel.send(e);


};

module.exports.help = {
    name: 'error',
    aliases: [],
    description: "Sends information about the error",
    usage: "[error code]",
    cooldown: 5,
    generated: true,
    inDev: false
};