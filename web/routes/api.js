module.exports.setup = (client) => {
    var express = require('express');
    var router = express.Router();

    const botApiAccess = [
        async(req, res, next) => {
            const { token } = req.query;
            let webuser = await client.data.webuserdb.findOne({ apiToken: token });
            if (!webuser) {
                return res.json({
                    status: 403,
                    message: "Please provide a valid API Token"
                }).end()
            }
            next();
        }
    ]

    const adminApiAccess = [
        async(req, res, next) => {
            const { token } = req.query;
            let webuser = await client.data.webuserdb.findOne({ apiToken: token });
            if (!webuser) {
                return res.json({
                    status: 403,
                    message: "Please provide a valid API Token"
                }).end()
            }
            if (!client.config.devs.includes(req.user.discordId)) {
                return res.json({
                    status: 403,
                    message: "You do not have access"
                }).end()
            }
            next();
        }
    ]

    router.get("/", (req, res) => {
        res.sendStatus(200).end()
    });

    router.get("/changelog", (req, res) => {
        res.json(client.data.changelog);
    });

    router.use("/guild", botApiAccess, require("./api/db/guild").setup(client))

    router.use("/channel", botApiAccess, require("./api/discord/channel").setup(client))

    router.use("/admin/process", adminApiAccess, require("./api/admin/process").setup(client))
    router.use("/admin/client", adminApiAccess, require("./api/admin/client").setup(client))

    router.get("*", (req, res) => {
        res.sendStatus(406).end();
    });
    router.post("*", (req, res) => {
        res.sendStatus(406).end();
    });
    router.put("*", (req, res) => {
        res.sendStatus(406).end();
    });
    router.patch("*", (req, res) => {
        res.sendStatus(406).end();
    });

    return router;
}