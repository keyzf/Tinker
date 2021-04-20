/**
 * 
 * @typedef {Object} DiscordEventInfo
 * @property {String} name a Discord event
 */

/**
 * Representing a Discord event, run when a Discord#Client calls it
 */
class DiscordEvent {


    constructor() {
        this.client;
        this.info; // name, aliases, description, usage
        this.execute; // the actual code that runs
    }

    _registerClient(client) {
        this.client = client;
    }

    run(...args) {
        this.execute(this.client, ...args);
    }

    /**
     * 
     * @param {DiscordEventInfo} options
     * @returns {undefined}
     */
    setInfo(options) {
        if (typeof options.name != "string") {
            throw new TypeError("INVALID_DISCORD_EVENT_INFO_OPTION - 'name' must be of type String");
        }

        this.info = options;
    }

    /**
     * 
     * @param {Function} func 
     */
    setExecute(func) {
        // TODO: Do I need to do any checking for Event setExecute?
        this.execute = func;
    }

}


module.exports = DiscordEvent;