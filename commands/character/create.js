const Command = require("../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "create",
    aliases: ["new"],
    category: "Fun",
    description: "Create a new character",
    usage: ""
});

cmd.setLimits({
    cooldown: 5
});

cmd.setPerms({
    botPermissions: ["MANAGE_MESSAGES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"],
    userPermissions: []
});

cmd.setExecute(async(client, message, args) => {
    const [{ prefix }] = await client.data.db.query(`select prefix from guilds where guildID='${message.guild.id}'`);

    const numCharacters = await client.data.db.query(`select count(id) from characters where ownerID='${message.author.id}'`);
    // TODO: check the user is premium and check the premium limit too
    if (numCharacters >= client.config.characters.limit) {
        message.channel.send(client.operations.generateEmbed.run({
            title: `Character Creator - Step 1 - Name`,
            description: "Please send the name of the your character. Only use the characters a-z, A-Z and keep the name shorter than 20 characters.",
            author: "Tinker's Characters",
            authorUrl: "./res/TinkerCharacter.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Created by", message.author, "")
        }));
        return;
    }

    const m = await message.channel.send(client.operations.generateEmbed.run({
        title: `Character Creator - Step 1 - Name`,
        description: "Please send the name of the your character. Only use the characters a-z, A-Z and keep the name shorter than 20 characters.",
        author: "Tinker's Characters",
        authorUrl: "./res/TinkerCharacter.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Created by", message.author, "")
    }));

    let nameMessageCollection;
    try {
        nameMessageCollection = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000, errors: ['time'] });
    } catch (e) {
        await m.edit(client.operations.generateEmbed({
            title: `Character Creator - Step 1 - Cancelled`,
            description: "You took too long and the creator was cancelled",
            author: "Tinker's Characters",
            authorUrl: "./res/TinkerCharacter.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Created by", message.author, "")
        }));
        return;
    }

    let nameMsg = nameMessageCollection.first();
    let name = nameMsg.content.replace(/[^\x00-\x7F]/g, "");
    client.operations.deleteCatch.run(nameMsg);
    if (name.length < 3 || name.length > 20) {
        return m.edit(client.operations.generateEmbed.run({
            title: "Character Creator - Step 1 - Name - Failed",
            description: "The name must only use ascii characters (A-Z, a-z, 0-9), be no more than 20 characters and no less than 3",
            author: "Tinker's Characters",
            authorUrl: "./res/TinkerExclamation-red.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Created by", message.author, "")
        }));
    }

    m.edit(client.operations.generateEmbed.run({
        title: "Character Creator - Complete!",
        description: `Congratulations, you have created ${name}\n${client.emojiHelper.sendWith(client.data.emojis.custom.loading)} Saving to database`,
        author: "Tinker's Characters",
        authorUrl: "./res/TinkerExclamation-red.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Created by", message.author, "")
    }));

    const characterID = client.utility.createUUID("char-*x*x*x*x*x*x*x*x*x")

    try {
        await client.data.db.query(`insert into characters(name, id, ownerID, health, level, xp) values(?, ?, ?, ?, ?, ?)`, [name, characterID, message.author.id, 20, 0, 0]);
    } catch (err) {
        m.edit(client.operations.generateEmbed.run({
            title: "Character Creator - Complete!",
            description: `Congratulations, you have created ${name}\n${client.emojiHelper.sendWith(client.data.emojis.ticks.redCross)} Save error, your character may not have been saved in the database`,
            author: "Tinker's Characters",
            authorUrl: "./res/TinkerExclamation-red.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Created by", message.author, "")
        }));

        client.logger.error(err.stack, { origin: __filename, channel: message.channel });
        const e = await client.operations.generateError.run(err.stack, "Failed to save character to database", { channel: message.channel, origin: __filename });
        message.channel.send(e);

        return;
    }

    m.edit(client.operations.generateEmbed.run({
        title: "Character Creator - Complete!",
        description: `Congratulations, you have created ${name}\n${client.emojiHelper.sendWith(client.data.emojis.ticks.greenTick)} Save complete, you can now set your active character using \`${prefix}character select ${characterID}\``,
        author: "Tinker's Characters",
        authorUrl: "./res/TinkerCharacter.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Created by", message.author, "")
    }));

});

module.exports = cmd;