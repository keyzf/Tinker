const Discord = require("discord.js");
const setResponses = require("../../res/setResponse");
const { db, Fields } = require("../../lib/db");

const noPerPage = 2;
// function
const generateEmbed = (start, all) => {
    const current = all.slice(start, start + noPerPage);
    const embed = new Discord.MessageEmbed();
    embed.setThumbnail(bot.user.displayAvatarURL());
    embed.setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL());
    embed.setDescription(`All of the current worlds`);
    embed.setTimestamp();
    embed.setTitle(`Showing worlds ${start + 1}-${start + current.length} out of ${all.length}`);
    current.forEach((world) => {
        embed.addFields(
            { name: `Infraction`, value: `${infraction.infractionType}` },
            { name: `Info`, value: `Status: ${world.publicStatus}
            ${world.started ? "World has started!" : "World has not started yet"}
            ${world.availabe ? "World can be joined!" : "World cannot be joined"}
            ${world.users.length} / ${world.maxSpace} players` }, );
    });
    return embed;
};
// end

module.exports.run = async(bot, message, args) => {

    // check the args!

    const m = await message.channel.send(setResponses.waitGetting());
    const allInfractions = db.prepare(`

    `);

    // send the embed with the first noPerPage worlds
    m.edit(generateEmbed(0, allInfractions)).then((message) => {
        // exit if there is only one page of worlds (no need for all of this)
        if (allInfractions.length <= noPerPage) return;
        // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
        message.react('➡️');
        const collector = message.createReactionCollector(
            // only collect left and right arrow reactions from the message author
            (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id,
            // time out after a minute
            { time: 30000 }
        );

        let currentIndex = 0
        collector.on('collect', (reaction) => {
            // remove the existing reactions
            message.reactions.removeAll().then(async() => {
                // increase/decrease index
                reaction.emoji.name === '⬅️' ? currentIndex -= noPerPage : currentIndex += noPerPage
                    // edit message with new embed
                message.edit(generateEmbed(currentIndex, allInfractions))
                    // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                if (currentIndex !== 0) await message.react('⬅️')
                    // react with right arrow if it isn't the end
                if (currentIndex + noPerPage < allInfractions.length) message.react('➡️')
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
    inDev: true
}