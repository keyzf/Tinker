const { errordb } = require("../../lib/db");
const { devs } = require("../../config/devs.json");
const generateDefaultEmbed = require("../../util/generateDefaultEmbed")

module.exports.run = async(bot, message, args, dbGuild) => {
    if (!args[0]) { return message.channel.send("Please provide an error code"); }

    errordb.remove({ _id: args[0] }).then(function(found) {
        
        let e = {
            title: `Error Code ${args[0]}`
        }
        
        if (!found.length) {
            e.description = "No error with that code could be found"
        } else {
            e.description = "Error has been removed from the file"
        }

        message.channel.send(generateDefaultEmbed(e));

    });

};

module.exports.help = {
    name: 'clearerror',
    aliases: ["removeerror", "deleteerror"],
    description: "removes error from file",
    usage: "[error code]",
    cooldown: 2,
    generated: true,
    limit: true
};