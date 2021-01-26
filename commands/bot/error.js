const { errordb } = require("../../lib/db");
const { devs } = require("../../config/devs.json");
const generateDefaultEmbed = require("../../util/generateDefaultEmbed");

module.exports.run = async(bot, message, args, dbGuild) => {
    if (!args[0]) { return message.channel.send("Please provide an error code"); }

    errordb.findOne({ _id: args[0] }).then(function(found) {
        let e = {
            title: `Error Code ${args[0]}`
        }
        if (!found) {
            e.description = "No error with that code could be found"
        } else {
            if (devs.includes(message.author.id)) {
                e.description = `\`\`\`js\n${found.error} \`\`\``
                e.fields = [
                    { name: "Timestamp", value: new Date(found.timestamp) },
                    { name: "User Message", value: found.userMsg}
                ]
            } else if (found.userMsg) {
                e.description = found.userMsg
                e.fields = [{ name: "Well?", value: "The error has been logged, please contact us and give us the error code" }]
            } else {
                e.description = "The error has been logged, please contact us and give us the error code"
            }
        }
        message.channel.send(generateDefaultEmbed(e));
    }).catch(async (e) => {
        logger.error(e.stack, { channel: message.channel, content: message.content });
        return await message.channel.send(await bot.shardFunctions.get("generateError").run(e, "Error trying to receive error info, ironic I know"));
    });

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