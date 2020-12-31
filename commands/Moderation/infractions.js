const Discord = require("discord.js");
const setResponses = require("../../data/setResponse");
const { db, Fields } = require("../../lib/db");

module.exports.run = async(bot, message, args) => {

    const noPerPage = 2;
    // function
    const generateEmbed = (start, all) => {
        const current = all.slice(start, start + noPerPage);
        const embed = new Discord.MessageEmbed();
        embed.setThumbnail(target.user.displayAvatarURL());
        embed.setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL());
        embed.setTimestamp();
        if (all.length < 1) {
            embed.setTitle(`There are no infractions marked against ${target.user.username}`);
        } else {
            embed.setTitle(`Showing infractions ${start + 1}-${start + current.length} out of ${all.length}`);
            embed.setDescription(`All of ${target.user.username} current infractions`);
        }
        current.forEach((infraction) => {
            embed.addFields({ name: `Infraction`, value: `${infraction.infractionType}` }, { name: `Info`, value: `Reason: ${infraction.infractionReason}
                By: <@${infraction.infractorUserID}>
                ` });
        });
        return embed;
    };
    // end

    // check the args!

    let target = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(message.author.id);

    const m = await message.channel.send(setResponses.waitGetting());
    const allInfractions = db.prepare(`
        SELECT * FROM Infractions
        WHERE ${Fields.InfractionFields.userID}='${target.id}' AND ${Fields.InfractionFields.guildID}='${message.guild.id}'
    `).all();

    // send the embed with the first noPerPage worlds
    m.edit(generateEmbed(0, allInfractions)).then((msg) => {
        // exit if there is only one page of worlds (no need for all of this)
        if (allInfractions.length <= noPerPage) return;
        // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
        msg.react('➡️');
        const collector = msg.createReactionCollector(
            // only collect left and right arrow reactions from the message author
            (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id,
            // time out after 30 secs
            { time: 30000 }
        );

        let currentIndex = 0
        collector.on('collect', (reaction) => {
            // remove the existing reactions
            msg.reactions.removeAll().then(async() => {
                // increase/decrease index
                reaction.emoji.name === '⬅️' ? currentIndex -= noPerPage : currentIndex += noPerPage
                    // edit msg with new embed
                msg.edit(generateEmbed(currentIndex, allInfractions))
                    // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                if (currentIndex !== 0) await msg.react('⬅️')
                    // react with right arrow if it isn't the end
                if (currentIndex + noPerPage < allInfractions.length) msg.react('➡️')
            });
        });
    });
}


module.exports.help = {
    name: "infraction",
    aliases: ["infractions"],
    description: "Shows you all of a users infractions",
    usage: "[@ user] OR [infraction ID]",
    generated: true,
    cooldown: 2,
}