/**
 * 
 * @typedef {Object} OperationInfo
 * @property {String} name a unique operation name
 */

/**
 * Representing an operation, a function stored within the client that can be called at any time
 */
class Operation {


    constructor() {
        this.client;
        this.info; // name, aliases, description, usage
        this.execute; // the actual code that runs
        this.botPermissions = [];
    }

    _registerClient(client) {
        this.client = client;
    }

    run(...args) {
        return this.execute(this.client, ...args);
    }

    checkPerms(guild, channel) {
        // check botPerms (Discord)
        if (!guild.me.permissions.has("SEND_MESSAGES", { checkAdmin: false })) {
            this.client.logger.warn(`Missing Permission - SEND_MESSAGES - Command: ${this.info.name}, Server: ${guild.name} (${guild.id})`)
            return false;
        }

        for (let i = 0; i < this.botPermissions.length; i++) {
            const perm = this.botPermissions[i];
            if (!guild.me.permissions.has(perm, { checkAdmin: false })) {
                channel.send(this.client.operations.generateEmbed.run({
                    title: "I need permission!",
                    description: `I need to have ${this.client.data.permissionsNames[perm] || perm} permission to run this command.\nIf you are unsure then give me administrator, it allows me to do everything I need`
                }));
                this.client.logger.debug(`Bot Missing Permission - ${perm} - Command: ${this.info.name}, Server: ${guild.name} (${guild.id})`)
                return false;
            }
        }
        return true;
    }

    /**
     * 
     * @param {PermissionsInfo} options 
     */
    setPerms(options) {
        // TODO: check data types and valid permissions
        this.botPermissions = options.botPermissions;
    }

    /**
     * 
     * @param {OperationInfo} options
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
        this.execute = func;
    }

}


module.exports = Operation;