const logger = require("../lib/logger");
const { Guild } = require('../lib/db.js');
const { create_UUID } = require("../lib/utilFunctions.js");

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require("cors");
const path = require("path");
const fs = require("fs");
// const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

const initializePassport = require('./passport-config');

const port = process.env.PORT;
var server;

var bot;

module.exports.setup = async function (bot) {

    bot = bot;

    await initializePassport(
        passport,
        function (passed_email, found) {
            userdb.find({ email: passed_email }, (err, docs) => {
                found(docs[0]);
            });
        },
        function (passed_id, found) {
            userdb.find({ _id: passed_id }, (err, docs) => {
                found(docs[0])
            });
        }
    );

    app.set("views", path.join(__dirname, "views"));
    app.set('view-engine', 'ejs');
    app.use(express.urlencoded({ extended: false }));
    app.use(flash());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride('_method'));

    app.use(cors());
    // app.use(expressLayouts)
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.json({ limit: "1mb" }));
    app.use(express.static(path.join(__dirname, "public")));

    // Setup Database
    const database = require("nedb");
    const userdb = new database("./dashboard/data/users.db");
    userdb.loadDatabase();
    logger.log("info", "dashboard user db loaded");

    // function reloadDB() {
    //   userdb.loadDatabase();
    // }

    app.get('/', checkAuthenticated, (req, res) => {
        res.render('index.ejs', { name: req.user.name })
    });

    app.get('/login', checkNotAuthenticated, (req, res) => {
        res.render('login.ejs')
    });

    app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/register', checkNotAuthenticated, (req, res) => {
        res.render('register.ejs');
    });

    app.post('/register', checkNotAuthenticated, async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            userdb.insert({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                dashId: [req.body.dashId]
            });
            res.redirect('/login');
        } catch {
            res.redirect('/register');
        }
    });

    app.delete('/logout', (req, res) => {
        req.logOut();
        res.redirect('/login');
    });

    app.get("/dashboard", checkAuthenticated, async (req, res) => {
        await bot.emit("updateRoles", req.user.dashId);

        const docs = await Guild.find({
            dashId: req.user.dashId
        });
        if (!docs.length) return res.render("dashboard.ejs", { name: req.user.name, msg: "We couldn't find a server with that dashboard ID", dashId: "", guild: null })
        var dbguild = docs[0];
        
        res.render("dashboard.ejs", { name: req.user.name, msg: "", dashId: req.user.dashId, dbguild });
    });

    app.post("/savesettings", checkAuthenticated, async (req, res) => {
        await Guild.updateOne(
            { dashId: req.user.dashId },
            {
                $set: {
                    prefix: req.body.prefix
                }
            });

        res.redirect("/dashboard");
    });

    app.get("/devbot", checkAuthenticated, (req, res) => {
        if(!req.user.dev) return res.redirect("/");
        res.render("devbot.ejs")
    });

    // !! ~~ Functions ~~ !! \\

    function checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/login');
    }

    function checkNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard');
        }
        next();
    }

}

module.exports.start = async function () {
    server = app.listen(port, () => {
        logger.log("info", `dashboard http server listening at port ${port}`);
    });
}