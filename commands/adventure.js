'use strict'

const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "adventure",
    aliases: ["advance", "adv"],
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


/**
 * @typedef {Object} AdventureEvent
 * @property {String} name
 * @property {Number} chance
 */

/**
 * @enum {AdventureEvent} AdventureEvents
 * @readonly
 */
const AdventureEvents = {
    travel: { name: "travel", chance: 4 },
    rest: { name: "rest", chance: 4 },
    ambush: { name: "ambush", chance: 2 },
    monster: { name: "monster", chance: 7 },
    trader: { name: "trader", chance: 1 }
}

const getRandomEvent = () => {
    const evs = Object.keys(AdventureEvents).map(key => {
        return AdventureEvents[key];
    });
    const totalChance = evs.reduce((acc, curr) => acc + curr.chance, 0);
    const rand = Math.floor(Math.random() * totalChance);
    let amt = 0;
    for (const ev of evs) {
        amt += ev.chance;
        if (amt > rand) {
            return ev;
        }
    }
};

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
    const [{name, ownerID, tilesTravelled, health, xp, level, inventory}] = await client.data.db.query(`Select * from characters where id=?`, [activeCharacter]);

    const ev = getRandomEvent();

    if (ev.name == AdventureEvents.travel.name) {
        await m.edit(client.operations.generateEmbed.run({
            description: "You travel for a day.... yes that means you go further"
        }));
    } else if (AdventureEvents.rest.name) {
        await m.edit(client.operations.generateEmbed.run({
            description: "You rest for a day.... yes that means you don't go further"
        }));
    } else if (AdventureEvents.ambush.name) {
        await m.edit(client.operations.generateEmbed.run({
            description: "You get ambushed"
        }));
    } else if (AdventureEvents.monster.name) {
        await m.edit(client.operations.generateEmbed.run({
            description: "monster"
        }));
    } else if (AdventureEvents.trader.name) {
        await m.edit(client.operations.generateEmbed.run({
            description: "trader"
        }));
    } else {
        await m.edit(client.operations.generateEmbed.run({
            description: "something went wrong"
        }));
    }



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

module.exports = command;

/*
async updateInstance() {
        this.character = await this.client.data.db.query(`select * from characters where id='${this.characterID}'`);
    }

async updateDB() {
    await this.client.data.db.query(`update characters set ${Object.keys(this.character).map((elt) => `${elt}=?`)} where userID='${this.characterID}'`, Object.values(this.character));
}
*/