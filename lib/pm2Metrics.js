const pm2io = require('@pm2/io');


    module.exports.noMessagesHandling = pm2io.counter({
        name: 'noMessagesHandling',
        type: 'counter'
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
