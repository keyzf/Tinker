const errorCodes = require("../../config/errorCodes.json").codes;

module.exports.run = async(bot, message, args, dbGuild) => {
    if (!args[0]) { return message.channel.send("Please provide an error code"); }


    let e = {
        title: `Error Code ${args[0]}`,
    }

    const found = errorCodes.filter((elt) => {
        return elt.code == args[0]
    });
    if (found.length > 1) { e.description = "There is and issue with the error code lookup file. Please contact a developer immediately" }
    else if (!found.length) { e.description = "Could not find error with that code" }
    else if (!found[0].userMsg) { e.description = "No error message is associated with that code" }
    else { 
        e.description = found[0].name
        e.fields = [
            { name: "User Message", value: `${found[0].userMsg}` },
            { name: "Dev Message", value: `${found[0].devMsg}` }
        ]
    }
    message.channel.send(generateDefaultEmbed(e));


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