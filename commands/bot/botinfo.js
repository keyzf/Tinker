const Discord = require("discord.js");
const generateDefaultEmbed = require("../../util/generateDefaultEmbed");

module.exports.run = async (bot, message, args, dbGuild) => {
    delete require.cache[require.resolve('../../data/botInfo.json')]
    var { botInfo } = require("../../data/botInfo.json");

    message.channel.send(generateDefaultEmbed({
        title: "Bot Information",
        description: "I'm going to tell you all about myself",
        fields: botInfo
    }));
};

module.exports.help = {
    name: 'botinfo',
    aliases: [],
    description: "Sends information about the bot",
    cooldown: 5,
    generated: true
};