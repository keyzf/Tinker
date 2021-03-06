'use strict'

const {Permissions} = require("discord.js");

module.exports.setup = (client) => {
    var express = require('express');
    var router = express.Router();

    router.get("/", (req, res) => {
        res.sendStatus(200).end()
    });

    router.get("/:guildId", async (req, res) => {
        const {guildId} = req.params;
        const {token} = req.query;
        // find guild
        const user = await client.data.webuserdb.findOne({apiToken: token});
        let userGuild = user.guilds.find((elt) => {
            return elt.id == guildId;
        });
        if (!userGuild) {
            return res.json({
                status: 404,
                message: `A guild with ID ${guildId} could not be found`
            }).end();
        }
        // check if they have permission to change settings
        if (!new Permissions(userGuild.permissions).has("MANAGE_GUILD") || !client.config.devs.includes(req.user.discordId)) {
            return res.json({
                status: 403,
                message: "You do not have permission to access this guild"
            }).end();
        }
        // get data from db
        const data = await client.data.db.getOne({table: "guilds", fields: ["*"], conditions: [`guildID='${guildId}'`]});
        res.json(data).end();
    });

    router.post("/:guildId/settings/prefix", async (req, res) => {
        const {guildId} = req.params;
        const {token} = req.query;
        // find guild
        const user = await client.data.webuserdb.findOne({apiToken: token});
        let userGuild = user.guilds.find((elt) => {
            return elt.id == guildId;
        });
        if (!userGuild) {
            return res.json({
                status: 404,
                message: `A guild with ID ${guildId} could not be found`
            }).end();
        }
        // check if they have permission to change settings
        if (!new Permissions(userGuild.permissions).has("MANAGE_GUILD") || !client.config.devs.includes(req.user.discordId)) {
            return res.json({
                status: 403,
                message: "You do not have permission to access this guild"
            }).end();
        }
        // extract variable settings from post body data
        const {prefix} = req.body;
        // get default settings for blank fields
        const {dbPrefix} = await client.data.db.getOne({
            table: "guilds",
            fields: ["prefix"],
            conditions: [`guildID='${guildId}'`]
        });
        // update db with changes
        await client.data.db.set({
            table: "guilds",
            field_data: {
                prefix: prefix || dbPrefix
            },
            conditions: [`guildID='${guildId}'`]
        });
        res.send(guildId).end();
    });

    return router;
}