const Command = require("../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "select",
    aliases: ["choose"],
    category: "Fun",
    description: "Select your active character",
    usage: "<character ID>"
});

cmd.setLimits({
    cooldown: 3
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

cmd.setExecute(async(client, message, args) => {
    if(!args || !args.length) {
        return message.channel.send("Please provide a character ID");
    }
    if(!args[0].startsWith("char-")) {
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

    await client.data.db.query(`update globalUser set activeCharacter=? where userID=${message.author.id}`, [args[0]]);

    message.channel.send(client.operations.generateEmbed.run({
        title: `${character.name} (${character.id}) - Selected`,
        author: "Tinker's Characters",
        authorUrl: "./res/TinkerCharacter.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
});

module.exports = cmd;