module.exports.setup = (client) => {
    var express = require('express');
    var router = express.Router();

    router.get("/", (req, res) => {
        res.render("adminDash");
    });

    return router;
}