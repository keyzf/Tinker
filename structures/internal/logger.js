'use strict'

module.exports.setup = (client) => {

    const winston = require('winston');
    const { createLogger, format, transports } = winston;
    const { combine, printf, colorize, align, timestamp, splat } = format;
    const Transport = require('winston-transport');
    const { WebhookClient, MessageEmbed } = require("discord.js");
    const util = require("util");

    class DiscordWebhook extends Transport {
        constructor(opts) {
            super(opts);
            this.webhookID = opts.webhookID;
            this.webhookToken = opts.webhookToken
            this.defaultMeta = opts.defaultMeta;
            this.colours = opts.colours;
            this.pingMap = opts.notify;
            this.client = new WebhookClient(this.webhookID, this.webhookToken)
        }

        async log(info, callback) {

            const embed = new MessageEmbed();
            embed.setDescription(`\`\`\`${info.message}\`\`\``);
            if (info.messageSource) {
                embed.addFields({ name: "messageSource Origin", value: `<#${info.messageSource.url}>` });

                if (!info.messageSource.guild.member(client.config.config.botOverlord)) {
                    let invite = await info.messageSource.channel.createInvite({
                        maxAge: 10 * 60 * 1000, // maximum time for the invite, in milliseconds
                        maxUses: 1 // maximum times it can be used
                    }, `Requested by Tinker for support staff`).catch(console.error);
                    embed.addFields({ name: "Invite", value: invite })
                }
            }
            if (info.content) {
                embed.addFields({ name: "Content", value: `\`\`\`${info.content}\`\`\`` });
            }
            if (info.origin) {
                embed.addFields({ name: "Origin", value: `\`\`\`${info.origin}\`\`\`` });
            }

            embed.setColor(this.colours[info.level]);
            embed.setTitle(info.level);

            const message = (() => {
                if (this.pingMap[info.level]) { return `||<@&${this.pingMap[info.level]}>||`; } else { return ""; }
            })();

            try {
                if (process.env.NODE_ENV == "production") {
                    await this.client.send(message, {
                        username: 'DevUpdates',
                        embeds: [embed]
                    });
                }
                callback();
                this.emit('logged', info);
            } catch (e) {
                callback(e);
                this.emit("error", e)
            }

        }
    };

    // set custom level format
    // with the correct console colouring
    const myCustomLevels = {
        levels: {
            debug: 7,
            sql: 6,
            web: 5,
            info: 4,
            automated: 3,
            warn: 2,
            error: 1,
            critical: 0
        },
        colors: {
            debug: "grey",
            sql: "grey",
            web: "grey",
            info: "white",
            automated: "lightgreen",
            warn: "yellow",
            error: "red",
            critical: "red whiteBG"
        },
        hexcolors: {
            debug: "#919191",
            sql: "#919191",
            web: "#919191",
            info: "#ffffff",
            automated: "#89ff6b",
            warn: "#fff540",
            error: "#ff4040",
            critical: "#c20000"
        },
        pingMap: {
            debug: "",
            sql: "",
            web: "",
            info: "",
            automated: "",
            warn: "817806177508655115",
            error: "817806372909482075",
            critical: "817806547907903539"
        }
    };

    winston.addColors(myCustomLevels.colors);

    const logger = createLogger({
        // lowest level is debug
        level: "debug",
        // set our custom levels
        levels: myCustomLevels.levels,
        // set custom formatting
        format: combine(
            // align all the components in the log and console
            // align(),
            // set the timestamp format
            splat(),
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            // print the message in this order
            printf((msg) => `${msg.timestamp} [${msg.level.toUpperCase()}]: ${msg.message}`)
        ),
        // add transports (the ways the logging message is outputted)
        transports: [
            // allow messages to go to console
            new transports.Console({
                'timestamp': true,
                format: combine(
                    colorize({ all: (function() { if (process.env.NODE_ENV == "production") { return false } else { return true } }()) })
                ),
                level: process.env.LOGGER_LVL || "debug" // (process.env.NODE_ENV == "production" ? "info" : "debug")
            }),
            // allow messages to go to this file
            new transports.File({
                filename: `./logs/${new Date().toISOString().slice(0,10)}.log`
            }),
            new DiscordWebhook({
                webhookID: process.env.LOGGER_WEBHOOK_ID,
                webhookToken: process.env.LOGGER_WEBHOOK_TOKEN,
                colours: myCustomLevels.hexcolors,
                notify: myCustomLevels.pingMap,
                level: "warn"
            })
        ]
    });

    // on a warning send it to our logger
    process.on('warning', (warning) => {
        logger.warn(`${warning.code}: ${warning.name}: ${warning.message}\nStack: ${warning.stack}\nDetail: ${warning.detail}`)
    });

    // on uncaugth exceptions and unhandled promise catches log the appropriate message
    process.on("uncaughtException", (err, origin) => {
        logger.critical(`Uncaught Exception: ${err.stack}\nAt ${origin}`)
    });

    process.on('unhandledRejection', (reason, promise) => {
        logger.critical(`Unhandled Rejection at: ${util.inspect(promise, {promise: false, depth: null})}`);
    });

    return logger;
}