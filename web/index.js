const express = require("express");

const flash = require("express-flash");
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const cors = require("cors");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const favicon = require('serve-favicon');

const isAuthenticatedElseLogin = require("./middlewares/isAuthenticatedElseLogin");
const cookiesEnabledElseCookiePolicy = require("./middlewares/cookiesEnabledElseCookiePolicy");

module.exports.setup = (client) => {
    const app = express();

    app.use(session({
        // name: "connect.sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        // store: new redisStore({host: '127.0.0.1', port: 6379, client: rediscli}), //, ttl: 260
        cookie: { maxAge: 172800000 } // 172800000: two days
    }));
    app.use(cookieParser());

    const discordAuthStrategy = require("./strategies/discordauth").setup(client);
    const passport = require("passport");
    app.use(passport.initialize());
    app.use(passport.session());

    app.set("views", path.join(__dirname, '/views'));
    app.set("view engine", "ejs");
    // allows for changes in view folder to be used (without server restart)
    // comment out if site becomes actively used and it affects performance
    app.disable('view cache');

    app.use(express.urlencoded({ extended: false }));
    app.use(flash());

    app.use(methodOverride("_method"));
    app.use(cors());
    app.use(expressLayouts);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.json({ limit: "1mb" }));
    app.use(express.static(path.join(__dirname, '/public')));

    app.use(favicon(path.join(__dirname, 'public', "images", 'favicon.png')))

    // setup default global locals
    // user (or undefined)
    // all flash messages
    // moment
    app.use((req, res, next) => {
        res.locals.user = req.user;
        res.locals.flashMsg = req.flash();
        next();
    });

    // Logging
    // const morgan = require("morgan");
    // app.use(morgan(function(tokens, req, res) {
    //     return [
    //         tokens.method(req, res),
    //         tokens.url(req, res),
    //         tokens.status(req, res),
    //         tokens.res(req, res, 'content-length'), '-',
    //         tokens['response-time'](req, res), 'ms'
    //     ].join(' ')
    // }));
    app.use((req, res, next) => {
        const method = req.method;
        const url = req.url;
        const status = res.statusCode;
        const log = `${method}:${url} ${status}`;
        client.logger.web(log);
        next();
    });

    // routing
    const indexroutes = require("./routes/index").setup(client);
    const authroutes = require("./routes/auth");
    const dashboardroutes = require("./routes/dashboard").setup(client);
    const apiroutes = require("./routes/api").setup(client);
    const adminroutes = require("./routes/admin").setup(client);

    app.use("/", indexroutes);
    app.use("/auth", cookiesEnabledElseCookiePolicy, authroutes);
    app.use("/dashboard", [cookiesEnabledElseCookiePolicy, isAuthenticatedElseLogin], dashboardroutes);
    app.use("/api", apiroutes);

    app.use("/admin", [
        cookiesEnabledElseCookiePolicy,
        isAuthenticatedElseLogin,
        (req, res, next) => {
            if (!client.config.devs.includes(req.user.discordId)) {
                req.flash("error", "This is a restricted endpoint");
                return res.redirect("/");
            }
            next();
        }
    ], adminroutes)

    // error catcher
    app.use((err, req, res, next) => {
        client.logger.error(err.stack)
        res.status(500);
        if (res.locals.flashMsg.error) { res.locals.flashMsg.error.push(err) } else { res.locals.flashMsg.error = [err] }
        res.render('error');
    });

    // normal browsing no-page catcher
    app.get("*", (req, res) => {
        // req.flash("error", "Uhh we couldn't find that page");
        if (res.locals.flashMsg.error) { res.locals.flashMsg.error.push("The page you were looking for either doesn't exist or is under maintenance") } else { res.locals.flashMsg.error = ["The page you were looking for either doesn't exist or is under maintenance"] }
        res.render("error");
    });

    const port = process.env.PORT;
    app.listen(port, () => {
        // logger.info(`Webserver listening at port ${port}`);
        client.logger.info(`Webserver listening at port ${port}`);
    });
    return app;
}