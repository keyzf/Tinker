'use strict'

var express = require('express');
var router = express.Router();

const passport = require("passport");
const isAuthenticatedThenDashboard = require('../middlewares/isAuthenticatedThenDashboard');

router.get("/", [
    isAuthenticatedThenDashboard,
    passport.authenticate("discord", {
        failureFlash: true,
        failureRedirect: "/"
    })
])

router.get("/redirect", [
    isAuthenticatedThenDashboard,
    passport.authenticate("discord", {
        failureFlash: true,
        failureRedirect: "/"
    })
], (req, res) => {
    res.redirect("/dashboard");
});

router.get("/logout", async(req, res) => {
    if (req.user) {
        req.logOut();
    }
    res.redirect("/")
});

module.exports = router;