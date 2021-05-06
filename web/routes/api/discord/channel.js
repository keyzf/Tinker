'use strict'


module.exports.setup = (client) => {
    var express = require('express');
    var router = express.Router();

    router.get("/all/:guildId", (req, res) => {
        const { token } = req.query;
        const { guildId } = req.params;
        const guild = client.guild.cache.get(guildId);
        // guild exists check
        const channels = guild.channels.cache;
        res.json(channels).end();

    });

    router.get("/:channelId", async (req, res) => {
        const { token } = req.query;
        const { channelId } = req.params;
        
        // find channel
        // check the guild
        // check user is in the guild
        // check user is allowed to edit settings of that guild
        // return channel data
    });

    return router;
}