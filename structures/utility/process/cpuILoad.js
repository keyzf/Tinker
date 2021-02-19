const os = require("os");

cpuIAverage = function(i) {
    var cpu, cpus, idle, len, total, totalIdle, totalTick, type;
    totalIdle = 0;
    totalTick = 0;
    cpus = os.cpus();
    cpu = cpus[i];
    for (type in cpu.times) {
        totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;

    idle = totalIdle / cpus.length;
    total = totalTick / cpus.length;
    return {
        idle: idle,
        total: total
    };
};

cpuILoadInit = function() {
    var index = arguments[0];
    return function() {
        var start;
        start = cpuIAverage(index);
        return function() {
            var dif, end;
            end = cpuIAverage(index);
            dif = {};
            dif.cpu = index;
            dif.idle = end.idle - start.idle;
            dif.total = end.total - start.total;
            dif.percent = 1 - dif.idle / dif.total;
            return dif;
        };
    };
};

module.exports = (function() {
    var info = [],
        cpus = os.cpus();
    for (i = 0, len = cpus.length; i < len; i++) {
        var a = cpuILoadInit(i)();
        info.push(a);
    }
    return function() {
        var res = [],
            cpus = os.cpus();
        for (i = 0, len = cpus.length; i < len; i++) {
            res.push(info[i]());
        }
        return res;
    }

})();