'use strict'

const { Permissions } = require('discord.js');

module.exports.setup = (client) => {
    var express = require('express');
    var router = express.Router();

    router.get("/", async(req, res) => {
        let guilds = []
        req.user.guilds.forEach(async(guild) => {
            if (client.guilds.cache.has(guild.id)) {
                if(new Permissions(guild.permissions).has("MANAGE_GUILD") || client.config.devs.includes(req.user.discordId)) { guild.manageable = true }
                guilds.push(guild);
            }
        });
        res.render("dashboard", {
            username: req.user.username,
            guilds
        });
    });

    router.get("/guild/:guildId", (req, res) => {
        const {guildId} = req.params;
        const guild = req.user.guilds.find((elt) => elt.id == guildId)
        if(!guild) {
            req.flash("error", `No guild with ID ${guildId} found`);
            res.redirect("/dashboard");
        }
        const {name, id } = client.guilds.cache.get(guildId);
        res.render("guildDash", {
            name,
            id
        });
    });


    return router;
}