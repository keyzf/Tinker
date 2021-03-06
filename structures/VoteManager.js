'use strict';

const { Client, Collection } = require("discord.js");
const axios = require("axios");

/**
 * @typedef {Object} UserVote
 * @property {string} id user ID of the voter
 * @property {number} timestamp of the last time the user voted
 * @property {boolean} voted whether they have a valid vote
 */

/**
 * @typedef {string} VoteUrl is the URL used to check the vote against, contains phrase ":id:" where the userID should be placed
 */

class VoteManager {
    /**
     *
     * @param {Client} client
     * @param {VoteUrl} voteUrl
     * @param {string} apiToken
     */
    constructor(client, voteUrl, apiToken) {
        this.client = client;
        this.cache = new Collection();

        const {base, end} = this.parseVoteUrl(voteUrl);
        this.baseUrl = base;
        this.endUrl = end;

        this.apiToken = apiToken;
    }

    parseVoteUrl(url) {
        const matches = url.match(/([ -~]+):([a-z]+):([ -~]+)?/);
        if(!matches || matches.length < 2){
            throw new Error("Invalid vote string given, e.g. 'https://website.com/user/:id:/checkvote'")
        }
        return {
            base: matches[1],
            end: matches[3] || ""
        }
    }

    /**
     * 
     * @param {string} id User ID
     * @returns {Promise<UserVote>} 
     */
    async getVote(id) {
        this._checkCacheOutdated(id);
        if (this.cache.get(id) === undefined) {
            await this._fetch(id);
        }
        return this.cache.get(id) === undefined ? null : this.cache.get(id);
    }

    /**
     * 
     * @param {string} id User ID
     * @returns {Promise<boolean|null>} true or false voted or not, cannot get vote null
     */
    async _fetch(id) {
        try {
            const { data } = await axios.default({
                method: "get",
                url: `${this.baseUrl}${id}${this.endUrl}`,
                headers: { accept: "application/json", Authorization: this.apiToken }
            });
            if (data.error) {
                return null;
            }
            const result = !!data.voted
            this._cacheVote(id, result);
            return result;
        } catch ({ stack }) {
            this.client.logger.error(stack, { origin: __filename });
            await this.client.operations.generateError.run(stack, `Error getting/parsing vote vote ${this.baseUrl}${id}${this.endUrl}`, { origin: __filename });
            return null;
        }
    }

    /**
     * 
     * @param {string} id User ID
     * @param {boolean} voted True on vote false on no vote
     * @returns {null}
     */
    _cacheVote(id, voted) {
        this.cache.set(id, {
            id,
            voted,
            timestamp: Date.now()
        }); // FIXME: WARNING this will assume the point of checking was also the point of voting, this can allow up to 24 hours of vote rewards if the user is cached 11hr 59mins after they voted. Most of the time this is not an issue as a user is asleep for the other 12 hours
        return null;
    }

    /**
     * 
     * @param {string} id User ID
     * @returns {boolean} returns true on outdated, false on in date
     */
    _checkCacheOutdated(id) {
        if (this.cache.has(id)) {
            const { timestamp } = this.cache.get(id);
            if (this._withinTwelveHours(timestamp, Date.now())) {
                return false;
            }
            this.cache.delete(id);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 
     * @param {number} timestampA smaller timestamp
     * @param {number} timestampB larger timestamp
     * @returns {boolean} true on within 12 hours, false on not
     */
    _withinTwelveHours(timestampA, timestampB) {
        return timestampB - timestampA < (12 * 60 * 60 * 1000);
    }
}

module.exports = VoteManager;