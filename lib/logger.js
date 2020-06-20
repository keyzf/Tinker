
const { createLogger, format, transports } = require('winston');
const { combine, printf } = format;

const logger = createLogger({
    format: combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    ),
    transports: [
        new transports.Console({ 'timestamp': true }),
        new transports.File({
            filename: "log.log"
        })
    ]
});

module.exports = logger;