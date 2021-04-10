const Discord = require("discord.js");
const Inventory = require("./Inventory.js");

/**
 * @typedef {Object} CharacterResolvable
 * @property {Number} [id]
 * @property {string} [ownerID]
 * @property {Number} health
 * @property {Number} level
 * @property {Number} xp
 * @property {Inventory} inventory
 */

class Character {
    /**
     * 
     * @param {Discord.Client} client 
     * @param {CharacterResolvable} character 
     */
    constructor(client, character) {
        this.client = client;

        this.id = character.id;
        this.ownerID = character.ownerID;
        this.health = character.health;
        this.level = character.level;
        this.xp = character.xp;
        this.inventory = character.inventory;
    }

    applyHealth(amount) {
        this.health = Math.abs(this.health + amount);
        return this.health;
    }

    applyXp(amount) {
        this.xp = this.xp + amount;
        this.level = 3 * Math.sqrt(this.xp);
        return {xp: this.xp, level: this.level};
    }

    getResolvable() {
        return {
            id: this.id,
            ownerID: this.ownerID,
            health: this.health,
            level: this.level,
            xp: this.xp,
            inventory: this.inventory
        }
    }
}

module.exports = Character;