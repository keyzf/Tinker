const logger = require("./logger");
const localDB = require("node-localdb");

module.exports.setup = async() => {
    const betterSql = require('better-sqlite3');

    const options = {
        verbose: logger.sql
    }

    const db = betterSql('./data/db.sqlite', options);
    module.exports.db = db;

    const quotesdb = localDB("./data/quotes.json");
    module.exports.quotesdb = quotesdb;
    logger.debug("quotesdb loaded");
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
        muteRoleID: "muteRoleID",

        logsChannel: "logsChannel",
        welcomeChannel: "welcomeChannel"
    },
    InfractionFields: {
        id: "infractionID",
        guildID: "infractionGuildID",
        userID: "infractionUserID",
        infractorUserId: "infractorUserID",
        type: "infractionType",
        channelID: "infractionChannelID",
        reason: "infractionReason"
    },
    EventFields: {
        guildID: "guildID",
        eventName: "eventName",
        eventDescription: "eventDescription",
        eventDeadline: "eventDeadline",
        eventID: "eventID",
        releaseTime: "releaseTime",
        webhookID: "webhookID",
        released: "released"
    },
    AnnouncementFields: {
        guildID: "guildID",
        announcementName: "announcementName",
        announcementDescription: "announcementDescription",
        announcementDeadline: "announcementDeadline",
        announcementID: "announcementID",
        releaseTime: "releaseTime",
        webhookID: "webhookID"
    }
}