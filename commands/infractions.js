const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "infractions",
    aliases: [],
    category: "Moderation",
    description: "View a users infractions",
    usage: "<@ user>"
});

command.setLimits({
    cooldown: 2,
    limited: false
});

command.setPerms({
    userPermissions: [],
    botPermissions: []
});

const { MessageEmbed } = require("discord.js");

command.setExecute(async(client, message, args, cmd) => {
    const noPerPage = 2;
    // function
    const generateEmbed = (start, all) => {
        const current = all.slice(start, start + noPerPage);
        const embed = new MessageEmbed();
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

    let target = message.guild.member(message.mentions.users.first());
    if (!target) {
        if (args[0]) {
            target = message.guild.member(await client.users.fetch(args[0]))
        } else {
            target = message.guild.member(message.author);
        }
    }

    const m = await message.channel.send(client.operations.get("generateDefaultEmbed")({
        title: `${client.data.emojis.custom.loading} Fetching User Infraction Info`,
        authorImage: false
    }));

    const allInfractions = client.data.db.prepare(`
        SELECT * FROM Infractions
        WHERE infractionUserID='${target.user.id}' AND infractionGuildID='${message.guild.id}'
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
});

module.exports = command;