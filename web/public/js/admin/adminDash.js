'use strict'

$(async() => {

    $("#restartProcessBtn").click(() => {
        $.ajax({
            type: "POST",
            url: `/api/admin/process/restart?token=${token}`,
            complete: (res) => {
                console.log(res);
            }
        });
    });

    $("#restartClientBtn").click(() => {
        $.ajax({
            type: "POST",
            url: `/api/admin/client/restart?token=${token}`,
            complete: (res) => {
                console.log(res);
            }
        });
    });

    $("#restartCommandsBtn").click(() => {
        $.ajax({
            type: "POST",
            url: `/api/admin/client/restart/commands?token=${token}`,
            complete: (res) => {
                console.log(res);
            }
        });
    });

    const serverOnline = $("#serverOnline");
    const serverOffline = $("#serverOffline");
    serverOnline.hide();
    serverOffline.show();

    const nodeInfo = $("#nodeInfo");
    const loadingProcessInfoContainer = $("#loadingProcessInfoContainer");

    nodeInfo.hide();
    loadingProcessInfoContainer.show();

    const cwd = $("#cwd");
    const execPath = $("#execPath");
    const platform = $("#platform");
    const version = $("#version");
    const pid = $("#pid");
    const uptime = $("#uptime");
    const lastUpdated = $("#lastUpdated");

    let maxCount = 15;
    let refreshRate = 10;

    const maxCountDisplay = $("#maxCountDisplay");
    maxCountDisplay.text(maxCount);
    const refreshRateDisplay = $("#refreshRateDisplay");
    refreshRateDisplay.text(refreshRate);

    const maxCountSlider = $("#maxCountSlider");
    const refreshRateSlider = $("#refreshRateSlider");

    maxCountSlider.on('input', function() {
        maxCount = maxCountSlider.val();
        maxCountDisplay.text(maxCountSlider.val());
    });

    refreshRateSlider.on('input', function() {
        refreshRate = refreshRateSlider.val();
        refreshRateDisplay.text(refreshRateSlider.val());
    });

    let memoryStack = []
    let cpuStack = []

    // first setup
    await new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `/api/admin/process/info?token=${token}`,
            success: (res) => {
                serverOnline.show();
                serverOffline.hide();

                cwd.text(res.cwd);
                execPath.text(res.execPath);
                platform.text(res.platform);
                version.text(res.version);
                pid.text(res.pid);
                uptime.text(res.prettyUptime);

                const time = new Date().toLocaleTimeString();

                lastUpdated.text(time);

                memoryStack.push(["Time", "TotalAvailable", "Heap", "UsedHeap"]);
                let memoryData = [res.memory.rss, res.memory.heapTotal, res.memory.heapUsed];
                memoryData.splice(0, 0, time)
                memoryStack.push(memoryData);

                let cpuData = ["Time"]
                res.cpus.forEach(cpu => {
                    cpuData.push(`${cpu.cpu}`);
                });
                cpuStack.push(cpuData)

                let mappedData = res.cpus.map((cpu) => { return parseFloat(cpu.percent.toFixed(2)) });
                mappedData.splice(0, 0, time)

                cpuStack.push(mappedData);

                resolve();
            },
            error: (res) => {
                console.error(res);
                serverOnline.hide();
                serverOffline.show();
            }
        })
    });


    // continuous updating

    const updateProcessInfo = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: `/api/admin/process/info?token=${token}`,
                success: (res) => {
                    const time = new Date().toLocaleTimeString();
                    lastUpdated.text(time);

                    let memoryData = [res.memory.rss, res.memory.heapTotal, res.memory.heapUsed];
                    memoryData.splice(0, 0, time);
                    memoryStack.push(memoryData);

                    let cpuData = res.cpus.map((cpu) => { return parseFloat(cpu.percent.toFixed(2)) });
                    cpuData.splice(0, 0, time);
                    cpuStack.push(cpuData);

                    uptime.text(res.prettyUptime);
                    resolve(res);
                },
                error: (res) => {
                    reject(res)
                }
            })
        });
    }

    const updateGraphs = () => {
        const memoryTitles = memoryStack[0];
        const endMemoryStack = memoryStack.slice(1).slice(-maxCount);
        memoryStack = [
            memoryTitles,
            ...endMemoryStack
        ]
        const memoryData = google.visualization.arrayToDataTable(memoryStack);
        const memoryOptions = {
            title: "Memory Usage",
            vAxis: { title: "B" },
            isStacked: true
        };
        const memoryChart = new google.visualization.SteppedAreaChart(document.getElementById("memoryChart"));
        memoryChart.draw(memoryData, memoryOptions);


        const cpuTitles = cpuStack[0];
        const endCpuStack = cpuStack.slice(1).slice(-maxCount);
        cpuStack = [
            cpuTitles,
            ...endCpuStack
        ]
        const cpuData = google.visualization.arrayToDataTable(cpuStack);
        const cpuOptions = {
            title: "CPU Usage",
            vAxis: { title: "%", minValue: 0 }
        };
        const cpuChart = new google.visualization.AreaChart(document.getElementById("cpuChart"));
        cpuChart.draw(cpuData, cpuOptions);

        nodeInfo.show();
        loadingProcessInfoContainer.hide();
    }

    const loop = () => {
        setTimeout(async() => {
            try {
                await updateProcessInfo();
                serverOffline.hide();
                serverOnline.show();
            } catch (e) {
                console.error(e);
                serverOffline.show();
                serverOnline.hide();
            }
            updateGraphs();
            loop();
        }, 1000 * refreshRate);
    }

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(() => {
        updateGraphs();
        loop();
    });

});