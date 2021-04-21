const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "adventure",
    aliases: [],
    category: "Adventuring",
    description: "",
    usage: ""
});

command.setLimits({
    cooldown: 5
});

command.setPerms({
    botPermissions: ["MANAGE_MESSAGES"],
    userPermissions: [],
    globalUserPermissions: ["indev.command.adventuring.adventure"],
    memberPermissions: ["command.adventuring.adventure"]
});

const Adventure = require("../structures/games/Adventure");

command.setExecute(async(client, message, args, cmd) => {

    // If they are already playing in another channel, stop them starting another (could cause conflicting hp, inventories, etc)
    const activeGame = client.activeAdventures.get(message.author.id);
    if (activeGame) {
        return message.channel.send(client.operations.generateEmbed.run({
            title: `Active game`,
            description: `Game already being played in ${activeGame.channel}`,
            author: "Tinker's Adventures",
            authorUrl: "./res/TinkerExclamation-red.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
        }));
    }

    // notify of setting up, stored message in order to edit it for the game
    const m = await message.channel.send(client.operations.generateEmbed.run({
        title: `${client.emojiHelper.sendWith(client.data.emojis.custom.loading)} Setting up`,
        author: "Tinker's Adventures",
        colour: client.statics.colours.tinker,
    }));

    const [{ prefix }] = await client.data.db.query(`select prefix from guilds where guildID='${message.guild.id}'`);

    // get active character ID from GlobalObject
    const [{ activeCharacter }] = await client.data.db.query(`Select activeCharacter from globalUser where userID=${message.author.id}`)
    if (!activeCharacter) {
        return m.edit(client.operations.generateEmbed.run({
            title: `No character selected`,
            description: `You must select a character before you can begin by running \`${prefix}character select [characterID]\``,
            author: "Tinker's Adventures",
            authorUrl: "./res/TinkerExclamation-red.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
        }));
    }
    // Get active character object
    const [character] = await client.data.db.query(`Select * from characters where id=?`, [activeCharacter]);

    const adventure = new Adventure(client, message.channel, message.author, character);
    // set active adventuring game (prevent multiple games running)
    client.activeAdventures.set(message.author.id, adventure);
    adventure.on("start", () => {
        client.operations.deleteCatch.run(m);
    }).on("end", async (stats) => {
        // TODO: stats.premature returns true if a full game was not made therefore reduced stats and no change to the DB required, false if all ran as expected

        // Finished message (with saving to DB part)
        const msg = await message.channel.send(client.operations.generateEmbed.run({
            title: `Adventure ended - ${client.emojiHelper.sendWith(client.data.emojis.custom.loading)} Saving to DB`,
            description: "This part as well as some fields gets filled with stats about the adventure but I haven't got this far yet :)",
            thumbnailUrl: "./res/TinkerAdventure.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Adventured by", message.author, "")
        }));
        
        // make changes to DB

        // update message
        msg.edit(client.operations.generateEmbed.run({
            title: `Adventure ended - ${client.emojiHelper.sendWith(client.data.emojis.ticks.greenTick)} Saved to DB`,
            description: "This part as well as some fields gets filled with stats about the adventure but I haven't got this far yet :)",
            thumbnailUrl: "./res/TinkerAdventure.png",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Adventured by", message.author, "")
        }));

        // remove active adventuring game
        client.activeAdventures.delete(message.author.id);
    });

    adventure.run();

});

module.exports = command;

/*
async updateInstance() {
        this.character = await this.client.data.db.query(`select * from characters where id='${this.characterID}'`);
    }

async updateDB() {
    await this.client.data.db.query(`update characters set ${Object.keys(this.character).map((elt) => `${elt}=?`)} where userID='${this.characterID}'`, Object.values(this.character));
}
*/