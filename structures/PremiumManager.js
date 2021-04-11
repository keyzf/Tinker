const Discord = require("discord.js");

/**
 * 
 * @readonly
 * @enum {String}
 */
const context = {
    guild: "guild",
    user: "user"
}

/**
 * @typedef {Object} PremiumManager
 * @property {function} userHasPremium
 * @property {function} guildHasPremium
 * 
 * @property {function} userPremium
 * @property {function} guildPremium
 */

/**
 * 
 * @typedef {Object} PremiumToken
 * @property {String} id
 * @property {Discord.Snowflake} userID
 * @property {references} references
 * @property {Discord.Snowflake} referencesID
 */

/**
 * 
 * @param {Discord.Client} client 
 * @returns {PremiumManager}
 */
module.exports.setup = (client) => {

    /**
     * 
     * @param {PremiumToken} token
     * @returns {PremiumToken || null} returns valid Premium token or removes invalid token and returns null
     */
    const validateToken = async (token) => {
        // check time period
        if (new Date(token.expiresAt).getTime() <= new Date().getTime()) {
            console.log("token removed")
            await client.data.db.query(`delete from premiumTokens where id='${token.id}'`);
        }
    }

    /**
     * 
     * @param {PremiumToken[]} tokens
     * @returns {PremiumToken[]} returns all valid Premium tokens and removes invalid tokens from db
     */
    const validateTokens = async (tokens) => {
        let validTokens = [];
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const validatedToken = await validateToken(token);
            if(validatedToken) {validTokens.push();}
        }
        return validTokens;
    }

    return {

        /**
         * 
         * @param {Discord.Snowflake} userID 
         * @returns {Boolean}
         */
        async userHasPremium(userID) {
            const tokens = await client.data.db.query(`select * from premiumTokens where context='${context.user}' and referenceID='${userID}'`);
            const validTokens = validateTokens(tokens);
            if (validTokens.length) {
                return true
            }
        },

        /**
         * 
         * @param {Discord.Snowflake} userID 
         * @returns {PremiumToken[]}
         */
        async userPremium(userID) {
            return await validateTokens(await client.data.db.query(`select * from premiumTokens where userID='${userID}'`));
        },

        /**
         * 
         * @param {Discord.Snowflake} guildID 
         * @returns {Boolean}
         */
        async guildHasPremium(guildID) {
            const tokens = await client.data.db.query(`select * from premiumTokens where context='${context.guild}' and referenceID='${guildID}'`);
            const validTokens = validateTokens(tokens);
            if (validTokens.length) {
                return true
            }
        },

        /**
         * 
         * @param {Discord.Snowflake} guildID 
         * @returns {PremiumToken[]}
         */
        async guildPremium(guildID) {
            return await validateTokens(await client.data.db.query(`select * from premiumTokens where context='guild' and referenceID='${guildID}'`));
        }

    }
}