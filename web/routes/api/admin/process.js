'use strict'

const ms = require("pretty-ms");

module.exports.setup = (client) => {
    var express = require('express');
    var router = express.Router();
    
    router.get("/info", async(req, res) => {
        
        const data = {
            cwd: process.cwd(),
            execPath: process.execPath,
            version: process.version,
            platform: process.platform,
            pid: process.pid,
            memory: process.memoryUsage(),
            cpus: client.utility.cpuILoad(),
            uptime: process.uptime(),
            prettyUptime: ms(process.uptime() * 1000)
        }
        res.json(data).end()
    });


    router.post("/restart", (req, res) => {
        res.sendStatus(102).end();
        client.cleanExit();
    });

    return router;
}