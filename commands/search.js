const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "search",
    aliases: [],
    category: "Music",
    description: "Search YT for music vids",
    usage: "<search criteria>"
});

cmd.setLimits({
    cooldown: 2,
    limited: false
});

cmd.setPerms({
    botPermissions: ["ADD_REACTIONS", "MANAGE_MESSAGES"],
    userPermissions: []
});

const yts = require("yt-search")

cmd.setExecute(async(client, message, args, cmd) => {

    const msg = await message.channel.send(await client.operations.get("generateDefaultEmbed")({ title: `${client.data.emojis.custom.loading} Fetching Video Info` }))

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

    const e = client.operations.get("generateDefaultEmbed")({
        title: `Search: ${searchCriteria}`,
        description: desc,
        author: "Tinker's Tunes",
        authorUrl: "./res/TinkerMusic-purple.png",
        footerText: `Requested by ${message.author.tag}`,
        footerUrl: message.author.displayAvatarURL()
    });
    msg.edit(e);

    let reactionArr = []
    for (var i = 0; i < vids.length; i++) {
        await msg.react(client.emojiHelper.reactWith(client.data.emojis.characterSet[i + 1]));
        reactionArr.push(client.emojiHelper.reactWith(client.data.emojis.characterSet[i + 1]));
    }

    if (!vids.length || vids.length == 0) {
        msg.edit(client.operations.get("generateDefaultEmbed")({
            title: `Search: ${searchCriteria}`,
            description: "No videos from that search result",
            author: "Tinker's Tunes",
            authorUrl: "./res/TinkerMusic-purple.png",
            footerText: `Requested by ${message.author.tag}`,
            footerUrl: message.author.displayAvatarURL()
        }));
        client.operations.get("deleteCatch")(msg, 8000);
        client.operations.get("deleteCatch")(message, 8000);
        return;
    }

    const filter = (reaction, user) => reactionArr.includes(reaction.emoji.name) && user.id === message.author.id;

    // use to collect a fixed number of reactions and deal with them once that limit is reached (or timeout is reached)
    msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(async(collection) => {
            let reaction = collection.first();
            // remove the existing reactions
            msg.reactions.removeAll().then(async() => {
                let link;
                // increase/decrease index
                if (reaction.emoji.name === "1️⃣") { link = videos[0].url }
                if (reaction.emoji.name === "2️⃣") { link = videos[1].url }
                if (reaction.emoji.name === "3️⃣") { link = videos[2].url }
                client.commands.get("play").run(message, [link], cmd);
                // remove selection embed
                await client.operations.get("deleteCatch")(msg, 0);
            })
        })
        .catch(() => {
            // console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
            msg.reactions.removeAll().then(() => {
                msg.edit(client.operations.get("generateDefaultEmbed")({ title: "You took too long to make a decision" }));
                client.operations.get("deleteCatch")(msg, 8000);
                client.operations.get("deleteCatch")(message, 8000);
            })
        });
});

module.exports = cmd;