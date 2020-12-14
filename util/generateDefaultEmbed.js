const { MessageEmbed, MessageAttachment } = require("discord.js")

/**
 * 
 * @param {String} title 
 * @param {String} description 
 * @param {{name: String, value: String}[]} fields 
 */
module.exports = (title, description, fields) => {
    const embed = new MessageEmbed();
       
    const attachment = new MessageAttachment("./res/icon.png", 'icon.png');
    embed.attachFiles(attachment)
    embed.setThumbnail('attachment://icon.png');
    embed.setColor('#a700bd')
    embed.setAuthor("DevsApp", "attachment://icon.png", 'https://discord.com/invite/')
    embed.setFooter('See you around!', "attachment://icon.png");
    embed.setTimestamp()

    embed.setTitle(title)
    embed.setDescription(description)
    
    for (var i = 0; i < fields.length; i++) {
        embed.addFields({ "name": `${fields[i].name}`, "value": `${fields[i].value}` })
    }
    
    return embed;
}
