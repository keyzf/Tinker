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
    cooldown: 2
});

command.setPerms({
    userPermissions: [],
    botPermissions: ["ADD_REACTIONS", "MANAGE_MESSAGES"],
    globalUserPermissions: ["user.command.moderation.infractions"],
    memberPermissions: ["command.moderation.infractions"]
});

const { MessageEmbed } = require("discord.js");

command.setExecute(async(client, message, args, cmd) => {
    let target;
    try {
        if (!args[0]) throw Error()
        target = message.guild.member(message.mentions.users.first())
        if (!target) {
            target = await message.guild.members.fetch(args[0]);
        };
    } catch {}
    if (!target) { target = message.guild.member(message.author) };
    if (target.user.bot) { return message.channel.send("You cannot perform moderation actions on bots") }

    const m = await message.channel.send(client.operations.generateEmbed.run({
        title: `${client.data.emojis.custom.loading} Fetching User Infraction Info`,
        thumbnailUrl: target.user.displayAvatarURL(),
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, ""),
        colour: client.statics.colours.tinker
    }));

    let [{infractions: allInfractionIDs}] = await client.data.db.query(`select infractions from users where userID='${target.user.id}' and guildID='${message.guild.id}'`);

    if (!allInfractionIDs) {
        return m.edit(client.operations.generateEmbed.run({
            description: "There are no infractions against this user",
            thumbnailUrl: target.user.displayAvatarURL(),
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, ""),
            colour: client.statics.colours.tinker
        }));
    }
    allInfractionIDs = allInfractionIDs.split(",")
    
    const allInfractions = await client.data.db.query(`select * from infractions where infractionID in (${allInfractionIDs.map((id) => `'${id}'`).join(",")})`);

    const noPerPage = 2;
    // function
    const generateEmbed = (start, all) => {
        const current = all.slice(start, start + noPerPage);
        let fields = [];
        current.forEach((infraction) => {
            fields.push({ name: infraction.infractionType, value: `Reason: ${infraction.infractionReason} \nBy: <@${infraction.infractorUserID}>` });
        });
        return client.operations.generateEmbed.run({
            title: `Showing infractions ${start + 1}-${start + current.length} out of ${all.length}`,
            fields,
            thumbnailUrl: target.user.displayAvatarURL(),
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, ""),
            colour: client.statics.colours.tinker,
            timestamp: true
        });
    };
    // end

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