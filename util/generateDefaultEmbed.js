const { MessageEmbed, MessageAttachment } = require("discord.js")

/**
 * 
 * @param {{title: String, description: String, fields: {name: String, value: String}[], colour: string, author: String, authorUrl: String, authorLink: String, thumbnailUrl: String, imageUrl: String, footerUrl: String, footerText: String}} embedInfo 
 */
module.exports = (embedInfo) => {
    const embed = new MessageEmbed();

    if (embedInfo.authorUrl) {
        embed.attachFiles(new MessageAttachment(embedInfo.authorUrl, "author.png"))
    } else {
        embed.attachFiles(new MessageAttachment("./res/icon.png", 'author.png'));
    }

    embed.setAuthor(embedInfo.author || "Tinker", "attachment://author.png", embedInfo.authorLink || 'https://discord.com/invite/aymBcRP')

    if (embedInfo.colour) { embed.setColor(embedInfo.colour) } else { embed.setColor('#a700bd') }

    if (embedInfo.title) { embed.setTitle(embedInfo.title) }
    if (embedInfo.description) { embed.setDescription(embedInfo.description) }

    if (embedInfo.fields) {
        for (var i = 0; i < embedInfo.fields.length; i++) {
            embed.addFields({ "name": `${embedInfo.fields[i].name}`, "value": `${embedInfo.fields[i].value}` })
        }
    }

    if (embedInfo.thumbnailUrl) {
        embed.attachFiles(new MessageAttachment(embedInfo.thumbnailUrl, "thumbnail.png"))
        embed.setThumbnail('attachment://thumbnail.png');
    }
    if (embedInfo.imageUrl) {
        embed.attachFiles(new MessageAttachment(embedInfo.imageUrl, "image.png"))
        embed.setImage('attachment://image.png');
    }
    if (embedInfo.footerUrl) {
        embed.attachFiles(new MessageAttachment(embedInfo.footerUrl, "footer.png"))
        embed.setFooter(embedInfo.footerText || "See you around!", "attachment://footer.png");
        // embed.setFooter(embedInfo.footerText || "See you around!", embedInfo.footerUrl);
    } else {
        embed.setFooter(embedInfo.footerText || "See you around!");
    }

    embed.setTimestamp()

    return embed;
}