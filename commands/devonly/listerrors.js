const { errordb } = require("../../lib/db");
const generateDefaultEmbed = require("../../util/generateDefaultEmbed");
const emojis = require("../../data/emoji_list.json");

module.exports.run = async(bot, message, args, dbGuild) => {

    const noPerPage = 8;
    // function
    const generateEmbed = (start, all) => {
        const current = all.slice(start, start + noPerPage);
        let e = {}
        if (all.length < 1) {
            e.title = `There are no errors to show`;
        } else {
            e.title = `Showing errors ${start + 1}-${start + current.length} out of ${all.length}`;
        }
        e.description = current.map((err) => {
            return err._id
        });
        return generateDefaultEmbed(e);
    };
    // end

    const m = await message.channel.send(generateDefaultEmbed({title:`${emojis.custom.loading} Fetching Error Info`}))
    const allErrors = await errordb.find();

    // send the embed with the first noPerPage worlds
    m.edit(generateEmbed(0, allErrors)).then((msg) => {
        // exit if there is only one page of worlds (no need for all of this)
        if (allErrors.length <= noPerPage) return;
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
                msg.edit(generateEmbed(currentIndex, allErrors))
                    // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                if (currentIndex !== 0) await msg.react('⬅️')
                    // react with right arrow if it isn't the end
                if (currentIndex + noPerPage < allErrors.length) msg.react('➡️')
            });
        });
    });

};

module.exports.help = {
    name: 'listerrors',
    aliases: ["allerrors", "errors"],
    description: "shows all errors",
    usage: "",
    cooldown: 2,
    generated: true,
    limit: true
};