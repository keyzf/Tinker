module.exports.setup = (client) => {

    const localDB = require("node-localdb");
    // const betterSql = require('better-sqlite3');

    const options = {
        verbose: client.logger.sql
    }

    // const db = betterSql('./data/db.sqlite', options);
    const Database = require("../Database/Database");

    let db;
    if (process.env.NODE_ENV == "production") {
        db = new Database(client, options, {socketPath: "/run/mysqld/mysqld.sock", user: "localRoot", database: "tinker"})
    } else {
        db = new Database(client, options, {
            host: "192.168.1.128",
            user: "tinkerClient",
            password: "theAgeOfInfo",
            database: "tinker"
        });
    }

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