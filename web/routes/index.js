'use strict'

module.exports.setup = (client) => {

    var express = require('express');
    var router = express.Router();

    // ## Normal
    router.get("/", async(req, res) => {
        const rv = client.utility.array_random(client.data.tinkerReviews);
        res.render("index", { review: rv });
    });
    router.get("/about", async(req, res) => {
        res.render("about");
    });
    router.get("/contact", async(req, res) => {
        res.render("contact");
    });
    router.get("/changelog", async(req, res) => {
        res.render("changelog");
    });
    // dashboard
    router.get("/premium", async(req, res) => {
        res.render("premium");
    });

    router.get("/cookies", async(req, res) => {
        res.render("cookies");
    });
    router.get("/dataprivacy", async(req, res) => {
        res.render("dataprivacy");
    });
    router.get("/acknowledgements", async(req, res) => {
        res.render("acknowledgements");
    });

    return router;
}