const yts = require('yt-search')
const generateDefaultEmbed = require("../../util/generateDefaultEmbed");

module.exports.run = async(bot, message, args, dbGuild) => {

    const searchCriteria = args.join(" ")
    const r = await yts(searchCriteria)

    const videos = r.videos.slice(0, 5)
    let vids = []
    videos.forEach((v) => {
        const views = String(v.views).padStart(10, ' ')
        vids.push({views, title: v.title, timestamp: v.timestamp, author: v.author.name})
    });

    desc = vids.reduce((accumulator, v) => {
        return accumulator += `${ v.title } (${ v.timestamp }) | ${ v.author } | ${ v.views } views\n`
    }, "")

    const e = generateDefaultEmbed({title: `Search: ${searchCriteria}`, description: desc, author: "Tinker's Tunes", authorUrl: "./res/TinkerMusic.png"})
    const msg = await message.channel.send(e)
    await msg.react("1️⃣");
    await msg.react("2️⃣");
    await msg.react("3️⃣");
    await msg.react("4️⃣");
    await msg.react("5️⃣");
    const collector = msg.createReactionCollector(
        // only collect left and right arrow reactions from the message author
        (reaction, user) => ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"].includes(reaction.emoji.name) && user.id === message.author.id,
        // time out after 30 secs
        { time: 30000 }
    );
    collector.on('collect', (reaction) => {
        // remove the existing reactions
        msg.reactions.removeAll().then(async() => {
            let link;
            // increase/decrease index
            if (reaction.emoji.name === "1️⃣") { link = videos[0].url }
            if (reaction.emoji.name === "2️⃣") { link = videos[1].url }
            if (reaction.emoji.name === "3️⃣") { link = videos[2].url }
            if (reaction.emoji.name === "4️⃣") { link = videos[3].url }
            if (reaction.emoji.name === "5️⃣") { link = videos[4].url }
            bot.commands.get("play").run(bot, message, [link], dbGuild)
            // remove selection embed
            msg.delete({timeout:0});
        });
    });
}

module.exports.help = {
    name: 'search',
    aliases: [],
    description: "plays music from YouTube given a search criteria",
    usage: "\"[search criteria]\"",
    cooldown: 2,
    inDev: false,
    generated: true
};