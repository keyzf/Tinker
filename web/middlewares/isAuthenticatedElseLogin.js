'use strict'

module.exports = function isAuthenticatedElseLogin(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth");
}