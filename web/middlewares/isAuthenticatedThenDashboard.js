module.exports = function isAuthenticatedThenDashboard(req, res, next) {
    if (req.isAuthenticated()) return res.redirect("/dashboard");
    next();
}