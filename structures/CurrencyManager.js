const Discord = require("discord.js");

/**
 * @typedef {Object} CurrencyTyping
 * @property {String} name - the name of the currency element
 * @property {Number} position - the position of this element, zero-based
 * @property {Number} conversionRate - the multiple to which this makes up the next element (blank for the same value)
 */

/**
 * @typedef {Object} CurrencyInfo
 * @property {String} name - the name of the currency
 * @property {Array.<CurrencyTyping>} currencyTyping
 */

class CurrencyManager {
    /**
     *
     * @param client {Discord.Client}
     * @param currencyInfo {CurrencyInfo}
     */
    constructor(client, currencyInfo) {
        this.client = client;
        this.currencyInfo = this.parseCurrencyInfo(currencyInfo);
    }

    convert() {

    }

    parseCurrencyInfo(ci) {
        if (!ci.name) {
            return throw new TypeError("name is a required option");
        }
        if (typeof ci.name !== "string") {
            return throw new TypeError("name option must be a string");
        }

        if (!ci.currencyTyping || !ci.currencyTyping.length) {
            return throw new TypeError("currencyTyping is a required option")
        }
        ci.currencyTyping.forEach((ct) => {
            if (!ct.name) {
                return throw new TypeError("name is a required currency typing option");
            }
            if (typeof ct.name !== "string") {
                return throw new TypeError("name currencyTyping must be a string");
            }

            if (!ct.position) {
                return throw new TypeError("position is a required currency typing option");
            }
            if (typeof ct.name !== "number") {
                return throw new TypeError("position currencyTyping must be a number");
            }

            if (ct.conversionRate) {
                if (typeof ct.conversionRate !== "number") {
                    return throw new TypeError("conversionRate currencyTyping must be a number");
                }
                if (ct.conversionRate < 0) {
                    return throw new RangeError("conversionRate currencyTyping must be positive")
                }
            }

        });
    }
}

module.exports = CurrencyManager;

const cm = new CurrencyManager(Discord.Client, {
    name: "traditional",
    currencyTyping: [
        {
            name: "copper",
            position: 0,
            conversionRate: 100
        },
        {
            name: "silver",
            position: 1,
            conversionRate: 100
        },
        {
            name: "gold",
            position: 2,
            conversionRate: 100
        }
    ]
});