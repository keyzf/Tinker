
// const { createLogger, format, transports } = require('winston');
// const { combine, printf } = format;

// const logger = createLogger({
//     format: combine(
//         format.timestamp({
//             format: 'YYYY-MM-DD HH:mm:ss'
//         }),
//         printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
//     ),
//     transports: [
//         new transports.Console({ 'timestamp': true }),
//         new transports.File({
//             filename: "log.log"
//         })
//     ]
// });

// module.exports = logger;

// get the necessary winston parts
const winston = require('winston');
const { createLogger, format, transports } = winston
const { combine, printf, colorize, align, timestamp } = format;


// set custom level format
// with the correct console colouring
const myCustomLevels = {
    levels: {
        debug: 6,
        sql: 5,
        info: 4,
        automated: 3,
        warn: 2,
        error: 1,
        critical: 0
    },
    colors: {
        debug: "grey",
        sql: "grey",
        info: "white",
        automated: "lightgreen",
        warn: "yellow",
        error: "red",
        critical: "red whiteBG"
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
                colorize({ all: true })
            ),
            level: process.env.LOGGER_LVL || "debug" // (process.env.NODE_ENV == "production" ? "info" : "debug")
        }),
        // allow messages to go to this file
        new transports.File({
            filename: "log.log"
        })
    ]
});

// on a warning send it to our logger
process.on('warning', (warning) => logger.warn(`${warning.code}: ${warning.name}: ${warning.message}\nStack: ${warning.stack}\nDetail: ${warning.detail}`));
// on uncaugth exceptions and unhandled promise catches logg the appropriate message
process.on("uncaughtException", (err, origin) => logger.critical(`Uncaught Exception: ${err.stack}\nAt ${origin}`));
// process.on('unhandledRejection', (reason, promise) => logger.critical('Unhandled Rejection at:', promise, 'reason:', reason));

// this is an example of emmitting a warning
// process.emitWarning('Something happened!', {
//     code: 'MY_WARNING',
//     detail: 'This is some additional information'
// });

module.exports = logger;