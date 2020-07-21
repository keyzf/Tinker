const Discord = require("discord.js");

module.exports.run = async (bot, message, args, dbGuild) => {
    delete require.cache[require.resolve('../../res/botInfo.json')]
    var { botInfo } = require("../../res/botInfo.json");

    const embed = new Discord.MessageEmbed();
    embed.setColor('#a700bd')
    embed.setTitle('Bot Information')
    embed.setDescription("I'm going to tell you all about myself")
    // .setThumbnail('../res/dev-icon.png')
    // .setImage('https://i.imgur.com/wSTFkRM.png')
    for (var i = 0; i < botInfo.length; i++) {
        embed.addFields({ "name": `${botInfo[i].name}`, "value": `${botInfo[i].value}` })
    }
    embed.setTimestamp()
    embed.setFooter('See you around!');
    message.channel.send(embed);
};

module.exports.help = {
    name: 'botinfo',
    aliases: [],
    description: "Sends information about the bot",
    cooldown: 5,
    generated: true
};