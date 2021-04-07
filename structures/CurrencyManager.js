/**
 * @typedef {Object} CurrencyTyping
 * @property {String} name - the name of the currency element
 * @property {Number} position - the position of this element, zero-based
 * @property {Number} relationToBase - the number of arbitrary units this is worth
 */

/**
 * @typedef {Object} CurrencyInfo
 * @property {String} name - the name of the currency
 * @property {Array.<CurrencyTyping>} currencyTyping
 */

/**
 * @typedef {Object} CurrencyChunk
 * @property {String} name
 * @property {Number} amount
 */

/**
 * @typedef {Object} ConversionOptions
 */


class CurrencyManager {
    /**
     *
     * @param currencyInfo {CurrencyInfo}
     */
    constructor(currencyInfo) {
        this.currencyInfo = this._parseCurrencyInfo(currencyInfo);
    }

    /**
     * 
     * @param {*} worth 
     * @param {ConversionOptions} options 
     */
    convert(worth, options) {

    }

    /**
     * 
     * @param {Array.<CurrencyChunk>} worth 
     * @returns {Array.<CurrencyChunk>} the highest value of currency elements that make up the given amount
     */
    convertToHighest(worth) {
        let endWorth = new Map();
        let totalWorth = worth.reduce((acc, curr) => {
            return acc + (this.currencyInfo.currencyTyping.find((elt) => elt.name == curr.name).relationToBase * curr.amount)
        }, 0);
        for (const currencyElt of this.currencyInfo.currencyTyping) {
            while (totalWorth - currencyElt.relationToBase >= 0) {
                totalWorth -= currencyElt.relationToBase;
                endWorth.set(currencyElt.name, endWorth.get(currencyElt.name) + 1 || 1)
            } 
        }
        return Array.from(endWorth, ([name, amount]) => ({ name, amount }));
    }

    /**
     * 
     * @param {Array.<CurrencyChunk>} worth 
     */
    convertToLowest(worth) {
        const totalWorth = worth.reduce((acc, curr) => {
            return acc + (this.currencyInfo.currencyTyping.find((elt) => elt.name == curr.name).relationToBase * curr.amount)
        }, 0);
        return { name: this.currencyInfo.currencyTyping[this.currencyInfo.currencyTyping.length-1].name, amount: totalWorth}
    }

    _parseCurrencyInfo(ci) {
        if (!ci.name) {
            throw new TypeError("name is a required option");
        }
        if (typeof ci.name !== "string") {
            throw new TypeError("name option must be a string");
        }

        if (!ci.currencyTyping || !ci.currencyTyping.length) {
            throw new TypeError("currencyTyping is a required option")
        }
        ci.currencyTyping.forEach((ct) => {
            if (!ct.name) {
                throw new TypeError("name is a required currency typing option");
            }
            if (typeof ct.name !== 'string') {
                throw new TypeError("name currencyTyping must be a string");
            }
            if (isNaN(ct.relationToBase) || typeof ct.relationToBase !== 'number') {
                throw new TypeError("relationToBase currencyTyping must be a number");
            }
            if (ct.relationToBase < 0) {
                throw new RangeError("relationToBase currencyTyping must be positive")
            }
        });
        if (!ci.currencyTyping.find((elt) => elt.relationToBase == 1)) {
            throw new RangeError("There must be at least one currency unit that is equivalent to 1 base unit")
        }
        ci.currencyTyping.sort((elta, eltb) => eltb.relationToBase - elta.relationToBase);
        return ci;
    }
}

module.exports = CurrencyManager;

const cm = new CurrencyManager({
    name: "traditional",
    currencyTyping: [
        { name: "copper", relationToBase: 1 },
        { name: "silver", relationToBase: 10 },
        { name: "gold",  relationToBase: 100 }
    ]
});

// Examples \\
// const smallest = cm.convertToLowest([
//     { name: "gold", amount: 1 },
//     { name: "silver", amount: 5 }
// ]);

// console.log(smallest)

// const biggest = cm.convertToHighest([
//     { name: "gold", amount: 2 },
//     { name: "silver", amount: 17 },
//     { name: "copper", amount: 112 }
// ]);

// console.log(biggest)

/*
function getClosestFromObj(arr, propPath, target) {
    return arr.reduce(function(r, a, i, aa) {
        return i && Math.abs(aa[r][propPath] - target) < Math.abs(a[propPath] - target) ? r : i;
    }, -1);
}

const arr = [
    {val: 1},
    {val: 8},
    {val: 50},
    {val: 121},
]
getClosestFromObj(arr, "val", 15);
returns 8 (the closest to 15)
*/