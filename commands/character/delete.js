const Command = require("../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "delete",
    aliases: ["del", "remove"],
    category: "Fun",
    description: "Delete a character",
    usage: "<character ID>"
});

cmd.setLimits({
    cooldown: 3
});

cmd.setPerms({
    botPermissions: ["ADD_REACTIONS", "MANAGE_MESSAGES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: []
});

cmd.setExecute(async(client, message, args) => {
    if (!args || !args.length) {
        return message.channel.send("Please provide a character ID");
    }
    if (!args[0].startsWith("char-")) {
        return message.channel.send("Please provide a valid character ID (starts with `char-`)");
    }

    const [{ prefix }] = await client.data.db.query(`select prefix from guilds where guildID='${message.guild.id}'`);

    const [character] = await client.data.db.query(`select * from characters where ownerID=${message.author.id} and id=?`, [args[0]]);

    if (!character) {
        return message.channel.send(client.operations.generateEmbed.run({
            title: `No character`,
            description: `No character exists with that ID under your name, maybe check your characters by running \`${prefix}character all\``,
            author: "Tinker's Character",
            authorUrl: "./res/TinkerExclamation-red.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
        }));
    }

    const m = await message.channel.send(client.operations.generateEmbed.run({
        title: `${character.name} (${character.id}) - Delete?`,
        description: "Are you sure you want to delete this character?",
        author: "Tinker's Characters",
        authorUrl: "./res/TinkerCharacter.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));

    await m.react(client.emojiHelper.reactWith(client.data.emojis.ticks.greenTick));
    await m.react(client.emojiHelper.reactWith(client.data.emojis.ticks.redCross));

    try {
        collection = await m.awaitReactions((reaction, user) => {
            return [client.emojiHelper.getName(client.data.emojis.ticks.greenTick),
                client.emojiHelper.getName(client.data.emojis.ticks.redCross)
            ].includes(reaction.emoji.name) && user.id === message.author.id
        }, { max: 1, time: 30000, errors: ['time'] });
    } catch (e) {
        await m.reactions.removeAll();
        await m.edit(client.operations.generateEmbed.run({
            title: `${character.name} (${character.id}) - Delete timeout`,
            description: "No character has been deleted",
            author: "Tinker's Characters",
            authorUrl: "./res/TinkerCharacter.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
        }));
        return;
    }

    reaction = collection.first();
    await m.reactions.removeAll();
    if (reaction.emoji.name === client.emojiHelper.getName(client.data.emojis.ticks.redCross)) {
        m.edit(client.operations.generateEmbed.run({
            title: `${character.name} (${character.id}) - Delete cancelled`,
            description: "No character has been deleted",
            author: "Tinker's Characters",
            authorUrl: "./res/TinkerCharacter.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
        }));
        return;
    }

    await client.data.db.query(`update globalUser set activeCharacter=? where userID=${message.author.id}`, [null]);
    await client.data.db.query(`delete from characters where id=?`, [args[0]]);

    m.edit(client.operations.generateEmbed.run({
        title: `${character.name} (${character.id}) - Deleted`,
        author: "Tinker's Characters",
        authorUrl: "./res/TinkerCharacter.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
});

module.exports = cmd;