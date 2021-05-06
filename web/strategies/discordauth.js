'use strict'

module.exports.setup = (client) => {
    const DiscordStrategy = require("passport-discord").Strategy;
    const passport = require("passport");

    const { v4: uuid } = require("uuid");

    passport.serializeUser(async(user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async(id, done) => {
        const user = await client.data.webuserdb.findOne({ _id: id });
        if (user) { return done(null, user) }
    });

    passport.use(new DiscordStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CLIENT_REDIRECT,
        scope: ["identify", "email", "guilds"]
    }, async(accessToken, refreshToken, profile, done) => {

        try {
            let user = await client.data.webuserdb.findOne({ discordId: profile.id });

            if (user) {
                user.guilds = profile.guilds;
                await client.data.webuserdb.update({ _id: user._id }, user);
                return done(null, user)
            }
            const savedUser = await client.data.webuserdb.insert({
                username: profile.username,
                discordId: profile.id,
                email: profile.email,
                guilds: profile.guilds,
                apiToken: uuid()
            });
            done(null, savedUser);
        } catch (e) {
            done(e, null)
        }
    }));
}