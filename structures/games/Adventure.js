const Discord = require("discord.js");
const Character = require("./Character");

const { EventEmitter } = require("events");

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

class Adventure extends EventEmitter {
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.Channel} channel
     * @param {Discord.User} user
     * @param {Character} character
     */
    constructor(client, channel, user, character) {
        super();
        this.client = client;
        this.channel = channel;
        this.user = user;
        this.character = character;
    }

    async run() {
        const m = await this.start();
        if (m) {
            await this.gameLoop(m);
            await this.end(true);
        } else {
            await this.end(false);
        }
    }

    async start() {
        this.emit("start");

        const m = await this.channel.send(this.client.operations.generateEmbed.run({
            title: `${this.user.username}, your adventure begins here`,
            description: "Before you lies a long and treacherous journey, are you up for the task?",
            thumbnailUrl: "./res/TinkerAdventure.png",
            colour: this.client.statics.colours.tinker
        }));

        await m.react(this.client.emojiHelper.reactWith(this.client.data.emojis.ticks.greenTick));
        await m.react(this.client.emojiHelper.reactWith(this.client.data.emojis.ticks.redCross));

        let collection;
        try {
            collection = await m.awaitReactions((reaction, user) => {
                return [this.client.emojiHelper.getName(this.client.data.emojis.ticks.greenTick),
                    this.client.emojiHelper.getName(this.client.data.emojis.ticks.redCross)
                ].includes(reaction.emoji.name) && user.id === this.user.id
            }, { max: 1, time: 30000, errors: ['time'] });
        } catch (e) {
            this.client.operations.deleteCatch.run(m);
            return;
        }

        let reaction = collection.first();
        if (reaction.emoji.name === this.client.emojiHelper.getName(this.client.data.emojis.ticks.redCross)) {
            this.client.operations.deleteCatch.run(m);
            return;
        }
        await m.reactions.removeAll();
        return m;
    }

    async gameLoop(m) {

        // get one event from weighted chance
        const ev = function() {
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
        }();

        // do event logic

        switch(ev.name) {
            case "travel":
                await msg.edit(client.operations.generateEmbed.run({
                    description: "You travel for a day.... yes that means you go further"
                }));
                break;
        }

        // advance
        const advMsg = await this.channel.send("Please write `advance` to continue");
        let advMsgCollection;
        try {
            advMsgCollection = await this.channel.awaitMessages(msg => msg.author.id == this.user.id, { max: 1, time: 30000, errors: ['time'] });
        } catch (e) {
            this.client.operations.deleteCatch.run(advMsg);
            return;
        }

        const advUserMsg = advMsgCollection.first();
        this.client.operations.deleteCatch.run(advMsg);
        if (advUserMsg.content.toLowerCase() == "advance") { // TODO: add advancing aliases
            this.client.operations.deleteCatch.run(advUserMsg);
            await this.gameLoop(m);
        }

        this.client.operations.deleteCatch.run(m);

    }

    /**
     * 
     * @param {Boolean} correctly true when adventure ended as expected, false after timeout or error
     */
    async end(correctly) {

        // collect some stats

        // send those stats back to the place the command was run
        this.emit("end", { message: "stats" }); // TODO: return some stats about the adventure (e.g. no enemies killed, xp earned, health lost, changes to inventory etc)
    }
}

module.exports = Adventure;