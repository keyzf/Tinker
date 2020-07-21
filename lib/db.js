const logger = require("./logger")

module.exports.setup = async () => {
    const betterSql = require('better-sqlite3');

    const options = { 
        verbose: logger.sql
    }

    const db = betterSql('./data/guilds.sqlite', options);
    module.exports.db = db;
    
}

module.exports.Fields = {
    UserFields: {
        userID: "userID",
        guildID: "guildID",
        messagesSent: "messagesSent",
        devPoints: "devPoints",
        level: "level",
        infractions: "infractions"
    },
    GuildFields: {
        guildID: "guildID",
        name: "name",
        prefix: "prefix",
        profanityFilter: "profanityFilter",
        preventSpam: "preventSpam",
        messageRewards: "messageRewards",
        ignoredSpamChannels: "ignoredSpamChannels",
        muteRoleID: "muteRoleID"
    },
    InfractionFields: {
        infractionID: "infractionID",
        infractionGuildID: "infractionGuildID",
        infractionUserID: "infractionUserID",
        infractionType: "infractionType",
        infractionChannelID: "infractionChannelID"
    }
}