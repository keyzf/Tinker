const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "advancedpoll",
    aliases: ["apoll"],
    category: "Poll",
    description: "Create a timed, intelligent poll",
    usage: ""
});

command.setLimits({
    cooldown: 5
});

command.setPerms({
    botPermissions: ["MANAGE_MESSAGES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    globalUserPermissions: ["indev.command.poll.advancedpoll"],
    memberPermissions: ["command.poll.advancedpoll"]
});

command.setExecute(async(client, message, args) => {


    const generateDefaultEmbed = require("../../util/generateDefaultEmbed");
    const emojis = require("../../data/emoji_list.json");
    const deleteCatch = require("../../util/deleteCatch");
    const { db, Fields } = require("../../lib/db");

    const PollType = {
        multipleChoice: "mc",
        thumbs: "t"
    }

    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
        return message.channel.send(`You do not have permission to use this command`);
    }

    let reaction;
    let collection;

    let channelMsg;
    let channel;

    let questionMsg;
    let question;

    let pollType;

    let answersMsg;
    let answers;

    let anonymousResults = false;

    let releaseMsg;
    let releaseTime;

    let durationMsg;
    let durationTime;

    // # Overview, continue/cancel # \\
    const msg = await message.channel.send(generateDefaultEmbed({
        title: "Advanced Poll Generator",
        description: `This is going to take your through the process of creating and recording the poll.\nReact with ${emojis.symbols.arrow_forward} to continue and with ${emojis.symbols.x} to cancel. Cancel at any time by ignoring a question`
    }));

    await msg.react(emojis.symbols.arrow_forward);
    await msg.react(emojis.symbols.x);

    try {
        collection = await msg.awaitReactions((reaction, user) => {
            return [emojis.symbols.arrow_forward, emojis.symbols.x].includes(reaction.emoji.name) && user.id === message.author.id
        }, { max: 1, time: 30000, errors: ['time'] });
    } catch (e) {
        await msg.reactions.removeAll();
        await msg.edit(generateDefaultEmbed({ title: "You took too long to make a decision, poll cancelled" }));
        return;
    }

    reaction = collection.first();
    await msg.reactions.removeAll();
    if (reaction.emoji.name === emojis.symbols.x) {
        await msg.edit(generateDefaultEmbed({
            title: "Advanced Poll Generator: Cancelled"
        }));
        return;
    }

    // # get poll channel # \\
    await msg.edit(generateDefaultEmbed({
        title: "Advanced Poll Generator: Poll Channel",
        description: `Please mention the channel you would like the poll to appear in ${emojis.symbols.page_facing_up}`
    }));

    try {
        collection = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000, errors: ['time'] });
    } catch (e) {
        await msg.edit(generateDefaultEmbed({ title: "You took too long to make a decision, poll cancelled" }));
        return;
    }

    channelMsg = collection.first()
    channel = channelMsg.mentions.channels.first() || message.guild.channels.cache.get(channelMsg.content);
    if (!channel) {
        await msg.edit(generateDefaultEmbed({ title: `${channelMsg.content} is not a valid channel, poll cancelled` }));
        deleteCatch(channelMsg);
        return;
    }
    if (!message.member.permissionsIn(channel.id).has(["SEND_MESSAGES", "MANAGE_MESSAGES"])) {
        await msg.edit(generateDefaultEmbed({ title: "You don't have permission to create a poll in this channel, poll cancelled" }));
        deleteCatch(channelMsg);
        return;
    }

    // # get poll question # \\
    await msg.edit(generateDefaultEmbed({
        title: "Advanced Poll Generator: Poll Question",
        description: `Please send the question you would like the poll to ask ${emojis.symbols.grey_question}`
    }));

    try {
        collection = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000, errors: ['time'] });
    } catch (e) {
        await msg.edit(generateDefaultEmbed({ title: "You took too long to make a decision, poll cancelled" }));
        return;
    }

    questionMsg = collection.first();
    question = questionMsg.content;
    if (question.length > 100) {
        await msg.edit(generateDefaultEmbed({ title: "Question is too long (over 100 characters), poll cancelled" }));
        return;
    }
    deleteCatch(questionMsg);

    // # get poll type # \\ (thumbs system, multiple choice)
    await msg.edit(generateDefaultEmbed({
        title: "Advanced Poll Generator: Poll Answer Type",
        description: `Please send the type of answer your poll should accept\n${emojis.people.thumbsup} thumbs up, thumbs down or ${emojis.objects.clipboard} multiple choice`
    }));

    await msg.react(emojis.people.thumbsup);
    await msg.react(emojis.objects.clipboard);

    try {
        collection = await msg.awaitReactions((reaction, user) => {
            return [emojis.people.thumbsup, emojis.objects.clipboard].includes(reaction.emoji.name) && user.id === message.author.id
        }, { max: 1, time: 30000, errors: ['time'] });
    } catch (e) {
        await msg.reactions.removeAll();
        await msg.edit(generateDefaultEmbed({ title: "You took too long to make a decision, poll cancelled" }));
        return;
    }

    reaction = collection.first();
    await msg.reactions.removeAll();
    if (reaction.emoji.name === emojis.objects.clipboard) {
        pollType = PollType.multipleChoice
    } else {
        pollType = PollType.thumbs
    }

    // # get answers (if multiple choice) # \\
    if (pollType == PollType.multipleChoice) {
        await msg.edit(generateDefaultEmbed({
            title: "Advanced Poll Generator: Poll Answers",
            description: `Please send the answers the poll should make available\nSeparate the answers with a \`|\``
        }));

        try {
            collection = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000, errors: ['time'] });
        } catch (e) {
            await msg.edit(generateDefaultEmbed({ title: "You took too long to make a decision, poll cancelled" }));
            return;
        }

        answersMsg = collection.first();
        answers = answersMsg.content.split("|").map((elt) => { return elt.trim() });
        if (answers.length > 10) {
            await msg.edit(generateDefaultEmbed({ title: "Too many answers (max 10), poll cancelled" }));
            return;
        }
        deleteCatch(answersMsg);
    }

    // # anonymous results # \\
    await msg.edit(generateDefaultEmbed({
        title: "Advanced Poll Generator: Anonymous Answers",
        description: `Should users be able to answer the poll anonymously ${emojis.people.bust_in_silhouette}`
    }));

    await msg.react(emojis.symbols.white_check_mark);
    await msg.react(emojis.symbols.x);

    try {
        collection = await msg.awaitReactions((reaction, user) => {
            return [emojis.symbols.white_check_mark, emojis.symbols.x].includes(reaction.emoji.name) && user.id === message.author.id
        }, { max: 1, time: 30000, errors: ['time'] });
    } catch (e) {
        await msg.reactions.removeAll();
        await msg.edit(generateDefaultEmbed({ title: "You took too long to make a decision, poll cancelled" }));
        return;
    }

    reaction = collection.first();
    await msg.reactions.removeAll();
    if (reaction.emoji.name === emojis.symbols.white_check_mark) {
        anonymousResults = true
    }

    // # release time # \\
    await msg.edit(generateDefaultEmbed({
        title: "Advanced Poll Generator: Release Time",
        description: `Please send the time you would like to release the poll in number of minutes from now (type 0 for instantly) ${emojis.objects.clock}`
    }));

    try {
        collection = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000, errors: ['time'] });
    } catch (e) {
        await msg.edit(generateDefaultEmbed({ title: "You took too long to make a decision, poll cancelled" }));
        return;
    }

    releaseMsg = collection.first();
    try {
        releaseTime = Date.now() + (parseInt(releaseMsg.content) * 60 * 1000);
    } catch {
        await msg.edit(generateDefaultEmbed({ title: "Not a valid number, poll cancelled" }));
        return;
    }
    deleteCatch(releaseMsg);

    // # poll duration # \\
    await msg.edit(generateDefaultEmbed({
        title: "Advanced Poll Generator: Poll Duration",
        description: `Please send the time you would like the poll to be active for in number of minutes (max 1 week: 10080) ${emojis.objects.clock}`
    }));

    try {
        collection = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000, errors: ['time'] });
    } catch (e) {
        await msg.edit(generateDefaultEmbed({ title: "You took too long to make a decision, poll cancelled" }));
        return;
    }

    durationMsg = collection.first();
    try {
        durationTime = parseInt(durationMsg.content) * 60 * 1000;
    } catch {
        await msg.edit(generateDefaultEmbed({ title: "Not a valid number, poll cancelled" }));
        return;
    }
    if (durationTime > 10080 * 60 * 1000) {
        await msg.edit(generateDefaultEmbed({ title: "Poll lasts for too long, poll cancelled" }));
        return;
    }
    if (durationTime < 10 * 60 * 1000) {
        await msg.edit(generateDefaultEmbed({ title: "Poll must last at least 10 minutes, poll cancelled" }));
        return;
    }
    deleteCatch(durationMsg);

    message.channel.send(`${channel.id}, ${question}, ${pollType}, ${answers.jon(",")}, ${anonymousResults}, ${releaseTime}, ${durationTime}`);

});

module.exports = command;