'use strict'

const Command = require("../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "view",
    aliases: ["see"],
    category: "Fun",
    description: "View your character",
    usage: ""
});

cmd.setLimits({
    cooldown: 5
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["indev.command.fun.character.view"],
    memberPermissions: ["command.fun.character.view"]
});

cmd.setExecute(async(client, message, args) => {

    const [{ prefix }] = await client.data.db.query(`select prefix from guilds where guildID='${message.guild.id}'`);

    const [{ activeCharacter }] = await client.data.db.query(`Select activeCharacter from globalUser where userID=${message.author.id}`);

    if (!activeCharacter) {
        return message.channel.send(client.operations.generateEmbed.run({
            title: `No character selected`,
            description: `You must select a character before you can begin by running \`${prefix}character select [name]\``,
            author: "Tinker's Character",
            authorUrl: "./res/TinkerExclamation-red.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
        }));
    }
    // Get active character object
    const [character] = await client.data.db.query(`Select * from characters where id=?`, [activeCharacter]);

    message.channel.send(client.operations.generateEmbed.run({
        title: `${character.name}`,
        // description: "other stats and info and stuff",
        fields: [
            {name: "Health", value: character.health, inline: true},
            {name: "Level", value: character.level || 0, inline: true},
            {name: "XP", value: character.xp || 0, inline: true},
        ],
        author: "Tinker's Characters",
        authorUrl: "./res/TinkerCharacter.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, ` • ID: ${character.id}`)
    }));
});

module.exports = cmd;