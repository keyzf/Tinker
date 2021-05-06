'use strict'

const Command = require("../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "all",
    aliases: ["seeall", "viewall"],
    category: "Fun",
    description: "View your character",
    usage: ""
});

cmd.setLimits({
    cooldown: 5
});

cmd.setPerms({
    botPermissions: ["MANAGE_MESSAGES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    globalUserPermissions: ["indev.command.fun.character.all"],
    memberPermissions: ["command.fun.character.all"]
});


cmd.setExecute(async(client, message, args) => {
    let noPerPage = 3;

    const m = await message.channel.send(client.operations.generateEmbed.run({
        title: `${client.emojiHelper.sendWith(client.data.emojis.custom.loading)} Getting your characters`,
        author: "Tinker's Characters",
        authorUrl: "./res/TinkerCharacter.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));

    const [{ prefix }] = await client.data.db.query(`select prefix from guilds where guildID='${message.guild.id}'`);
    const characters = await client.data.db.query(`select * from characters where ownerID='${message.author.id}'`);

    const generateEmbed = (start, all) => {
        const current = all.slice(start, start + noPerPage);

        let fields = [];
        current.forEach((char) => {
            fields.push({ name: `${char.name} (${char.id})`, value: `Other stats and information stuff` });
        });

        const embed = client.operations.generateEmbed.run({
            title: `Showing characters ${start + 1}-${start + current.length} out of ${all.length}`,
            fields,
            author: "Tinker's Characters",
            authorUrl: "./res/TinkerCharacter.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
        });

        return embed;
    };


    if (!characters || !characters.length) {
        return m.edit(client.operations.generateEmbed.run({
            description: `You have no characters, create one by typing \`${prefix}character create\``,
            authorUrl: "./res/TinkerExclamation-red.png",
            author: "Tinker's Characters",
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, ""),
            colour: client.statics.colours.tinker
        }));
    }

    // send the embed with the first noPerPage
    m.edit(generateEmbed(0, characters)).then((msg) => {
        // exit if there is only one page (no need for all of this)
        if (characters.length <= noPerPage) return;
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
                msg.edit(generateEmbed(currentIndex, characters))
                    // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                if (currentIndex !== 0) await msg.react('⬅️')
                    // react with right arrow if it isn't the end
                if (currentIndex + noPerPage < characters.length) msg.react('➡️')
            });
        });
    });

});

module.exports = cmd;