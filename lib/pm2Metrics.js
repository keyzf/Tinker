const pm2io = require('@pm2/io');

module.exports.setup = () => {
    pm2io.init({
        metrics: {
            // transactions: true,
            http: true,
            runtime: true,
            eventLoop: true,
            network: false, // true causes event emitter MaxListenersExceededWarning as it doesn't clear events on network read, wait for pm2 to fix
            v8: true,
            gc: true
        }
    });

    module.exports.noCommandsHandling = pm2io.counter({
        name: 'noCommandsHandling'
    });

    module.exports.dbAccessPerMin = pm2io.meter({
        name: 'dbAccessPerMin',
        samples: 60, // number of events per 60 seconds
        timeframe: 600 // over the last 600 seconds (10 mins)
    });

    module.exports.apiLatency = pm2io.histogram({
        name: 'apiLatency',
        measurement: 'mean'
    });

}