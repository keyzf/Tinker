module.exports.setup = (client) => {

    const localDB = require("node-localdb");
    const betterSql = require('better-sqlite3');

    const options = {
        verbose: client.logger.sql
    }

    const db = betterSql('./data/db.sqlite', options);
    const quotesdb = localDB("./data/quotes.json");
    const errordb = localDB("./data/genErrors.json");
    const webuserdb = localDB("./data/webUsers.json");

    return { db, quotesdb, errordb, webuserdb };
}



/*
module.exports.Fields = {
    UserFields: {
        userID: "userID",
        guildID: "guildID",
        messagesSent: "messagesSent",
        currencyUnits: "currencyUnits",
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

        dashboardID: "dashboardID",

        logsChannel: "logsChannel",
        welcomeChannel: "welcomeChannel",

        notifiableRoles: "notifiableRoles"
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
    },
    Notifies: {
        guildID: "guildID",
        roleID: "roleID",
        timeout: "timeout"
    }
}
*/