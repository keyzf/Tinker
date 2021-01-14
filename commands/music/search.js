const yts = require('yt-search');
const generateDefaultEmbed = require("../../util/generateDefaultEmbed");
const deleteCatch = require("../../util/deleteCatch");
const emojis = require("../../data/emoji_list.json");

module.exports.run = async(bot, message, args, dbGuild) => {

    const msg = await message.channel.send(generateDefaultEmbed({title:`${emojis.custom.loading} Fetching Video Info`}))

    const searchCriteria = args.join(" ");
    const r = await yts(searchCriteria);

    const videos = r.videos.slice(0, 3);
    let vids = [];
    videos.forEach((v) => {
        const views = String(v.views).padStart(10, ' ');
        vids.push({ views, title: v.title, timestamp: v.timestamp, author: v.author.name });
    });

    desc = vids.reduce((accumulator, v) => {
        return accumulator += `**${vids.indexOf(v) + 1}** ${ v.title } (${ v.timestamp }) | ${ v.author }\n`; // | ${ v.views } views
    }, "");

    const e = generateDefaultEmbed({
        title: `Search: ${searchCriteria}`,
        description: desc,
        author: "Tinker's Tunes", authorUrl: "./res/TinkerMusic.png", footerText: `Requested by ${message.author.tag}`, footerUrl: message.author.displayAvatarURL() });
    msg.edit(e);
    await msg.react("1️⃣");
    await msg.react("2️⃣");
    await msg.react("3️⃣");
    // await msg.react("4️⃣");
    // await msg.react("5️⃣");

    const filter = (reaction, user) => ["1️⃣", "2️⃣", "3️⃣", /*"4️⃣", "5️⃣"*/].includes(reaction.emoji.name) && user.id === message.author.id;

    // use to collect a fixed number of reactions and deal with them once that limit is reached (or timeout is reached)
    msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
        .then((collection) => {
            let reaction = collection.first();
            // remove the existing reactions
            msg.reactions.removeAll().then(async() => {
                let link;
                // increase/decrease index
                if (reaction.emoji.name === "1️⃣") { link = videos[0].url }
                if (reaction.emoji.name === "2️⃣") { link = videos[1].url }
                if (reaction.emoji.name === "3️⃣") { link = videos[2].url }
                // if (reaction.emoji.name === "4️⃣") { link = videos[3].url }
                // if (reaction.emoji.name === "5️⃣") { link = videos[4].url }
                bot.commands.get("play").run(bot, message, [link], dbGuild)
                    // remove selection embed
                msg.delete({ timeout: 0 });
            })
        })
        .catch(collected => {
            // console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
            msg.reactions.removeAll().then(() => {
                msg.edit(generateDefaultEmbed({title:"You took too long to make a decision"}));
                deleteCatch(msg, 8000);
                deleteCatch(message, 8000);
            })
        });
};

module.exports.help = {
    name: 'search',
    aliases: [],
    description: "plays music from YouTube given a search criteria",
    usage: "\"[search criteria]\"",
    cooldown: 2,
    inDev: false,
    generated: true
};