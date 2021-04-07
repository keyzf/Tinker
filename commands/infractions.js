const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "infractions",
    aliases: [],
    category: "Moderation",
    description: "View a users infractions",
    usage: "[@ user]"
});

command.setLimits({
    cooldown: 2,
    limited: false
});

command.setPerms({
    userPermissions: [],
    botPermissions: ["ADD_REACTIONS", "MANAGE_MESSAGES"]
});

const {MessageEmbed} = require("discord.js");

command.setExecute(async (client, message, args, cmd) => {
    const noPerPage = 2;
    // function
    const generateEmbed = (start, all) => {
        const embed = new MessageEmbed();
        embed.setThumbnail(target.user.displayAvatarURL());
        embed.setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL());
        embed.setTimestamp();

        const current = all.slice(start, start + noPerPage);
        current.forEach((infraction) => {
            embed.addFields(
                {name: `Infraction`, value: `${infraction.infractionType}`},
                {name: `Info`, value: `Reason: ${infraction.infractionReason} By: <@${infraction.infractorUserID}>`}
            );
        });
        embed.setTitle(`Showing infractions ${start + 1}-${start + current.length} out of ${all.length}`);
        embed.setDescription(`All of ${target.user.username} current infractions`);

        return embed;
    };
    // end

    // check the args!

    let target = message.guild.member(message.mentions.users.first())
    if (!target) {
        if (args[0]) {
            target = message.guild.member(await client.users.fetch(args[0]));
            if (!target) {
                return message.channel.send("Could not find user in this guild");
            }
        } else {
            target = message.guild.member(message.author);
        }
    }

    const m = await message.channel.send(client.operations.generateEmbed.run({
        title: `${client.data.emojis.custom.loading} Fetching User Infraction Info`,
        authorImage: false
    }));

    const allInfractions = await client.data.db.query(`select * from infractions where infractionUserID='${target.user.id}' and infractionGuildID='${message.guild.id}'`);

    if(!allInfractions || !allInfractions.length) {
        return m.edit(client.operations.generateEmbed.run({
            description: "There are no infractions against this user",
            thumbnailUrl: target.user.displayAvatarURL(),
            ... client.statics.defaultEmbed.footerUser,
            colour: client.statics.colours.tinker
        }));
    }

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
            {time: 30000}
        );

        let currentIndex = 0
        collector.on('collect', (reaction) => {
            // remove the existing reactions
            msg.reactions.removeAll().then(async () => {
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