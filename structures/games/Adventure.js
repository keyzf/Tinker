const Discord = require("discord.js");
const Character = require("./Character");

const { EventEmitter } = require("events");

class Adventure extends EventEmitter {
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.User} user
     * @param {Character} character
     */
    constructor(client, channel, user, character) {
        super();
        this.client = client;
        this.channel = channel;
        this.user = user;
        this.character = character;

        this.prepareStart().then(async() => {
            await this.start();
            await this.gameLoop();
            await this.end();
        });
    }

    async prepareStart() {
        // mark active adventuring game
        this.client.activeAdventures.set(this.user.id, this);
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

        reaction = collection.first();
        if (reaction.emoji.name === this.client.emojiHelper.getName(this.client.data.emojis.ticks.redCross)) {
            this.client.operations.deleteCatch.run(m);
            return;
        }
        await m.reactions.removeAll();
    }

    async gameLoop() {

    }

    async end() {
        
        // remove active adventuring game mark
        this.client.activeAdventures.delete(this.user.id);

        this.emit("end", {message: "stats"}); // TODO: return some stats about the adventure (e.g. no enemies killed, xp earned, health lost etc)
    }
}

module.exports = Adventure;