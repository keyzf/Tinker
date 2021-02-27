const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "generateEmbed"
});


const { MessageEmbed, MessageAttachment } = require("discord.js")

/**
 * 
 * @typedef {Object} GenerateEmbedOptions
 * @property {String} name a unique command name
 */


/**
 * 
 * @param {GenerateEmbedOptions} embedInfo 
 */
op.setExecute((client, embedInfo) => {
    const embed = new MessageEmbed();

    if (embedInfo.authorUrl) { embed.attachFiles(new MessageAttachment(embedInfo.authorUrl, "author.png")); }
    if (embedInfo.author) {
        embed.setAuthor(embedInfo.author, "attachment://author.png", embedInfo.authorLink || "")
    }

    if (embedInfo.colour) { embed.setColor(embedInfo.colour) }

    if (embedInfo.title) { embed.setTitle(embedInfo.title) }
    if (embedInfo.description) { embed.setDescription(embedInfo.description) }

    if (embedInfo.fields) {
        for (var i = 0; i < embedInfo.fields.length; i++) {
            embed.addFields({ "name": `${embedInfo.fields[i].name}`, "value": `${embedInfo.fields[i].value}`, inline: embedInfo.fields[i].inline })
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
    }
    if (embedInfo.footerText) {
        embed.setFooter(embedInfo.footerText, "attachment://footer.png")
    }

    if (embedInfo.timestamp) { embed.setTimestamp() }

    return embed;
});

module.exports = op;