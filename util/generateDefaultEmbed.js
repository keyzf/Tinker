const { MessageEmbed, MessageAttachment } = require("discord.js")

/**
 * 
 * @param {{title: String, description: String, fields: {name: String, value: String}[]}} embedInfo 
 */
module.exports = (embedInfo) => {
    const embed = new MessageEmbed();

    embed.attachFiles(new MessageAttachment("./res/icon.png", 'icon.png'));
    embed.setAuthor("Tinker", "attachment://icon.png", 'https://discord.com/invite/aymBcRP')
    embed.setColor('#a700bd')
    embed.setTimestamp()

    if (embedInfo.title) { embed.setTitle(embedInfo.title) }
    if (embedInfo.description) { embed.setDescription(embedInfo.description) }

    if (embedInfo.fields) {
        for (var i = 0; i < embedInfo.fields.length; i++) {
            embed.addFields({ "name": `${embedInfo.fields[i].name}`, "value": `${embedInfo.fields[i].value}` })
        }
    }

    if (embedInfo.thumbnailUrl) {
        embed.attachFiles(embedInfo.thumbnailUrl, "thumbnail.png")
        embed.setThumbnail('attachment://thumbnail.png');
    }
    if (embedInfo.imageUrl) {
        embed.attachFiles(embedInfo.imageUrl, "image.png")
        embed.setImage('attachment://image.png');
    }
    if (embedInfo.footerUrl) {
        embed.attachFiles(embedInfo.footerUrl, "footer.png")
        embed.setFooter(embedInfo.footerText || "See you around!", "attachment://footer.png");
    } else {
        embed.setFooter(embedInfo.footerText || "See you around!");
    }

    return embed;
}