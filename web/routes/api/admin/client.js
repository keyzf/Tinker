'use strict'

module.exports.setup = (client) => {
    var express = require('express');
    var router = express.Router();

    router.get("/info", async(req, res) => {
        res.json({ message: "empty" }).end()
    });

    router.post("/restart", async(req, res) => {
        await client.destroy();
        await client.login(process.env.DISCORD_CLIENT_TOKEN);
        res.sendStatus(200).end();
    });

    router.post("/restart/commands", async(req, res) => {
        let cmd_files = client.utility.find(client.commandDir, `.js`);

        await cmd_files.forEach(async (cmd) => {
            await client.removeCommand(cmd);
            await client.registerCommand(require(cmd));
        });
        res.sendStatus(200).end();
    });

    return router;
}