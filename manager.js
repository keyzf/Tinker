function setupChild() {
    let restartEnabled = false;

    const { fork } = require('child_process');

    const clear = require('clear');

    // Read messages from the console.
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    let client = fork('index.js');
    console.log(client)

    // client.stdout.on('data', function(data) {
    //     console.log(data.toString());
    // });

    client.on("message", (data) => {
        switch (data.command) {
            case ("restart"):
                restart()
                break;
            case ("shutdown"):
                shutdown()
                break;
            default:
                console.log(data);
                break;
        }
    })

    function restart() {
        console.log("Client requested restart");
        client.send({ action: "shutdown" });
        setupChild()
    }

    function shutdown() {
        console.log("Client requested stop");
        client.send({ action: "shutdown" });
    }
    // used to stop restarts when the process ends

    client.on("exit", () => {
        if (restartEnabled) { setupChild() } else { process.exit() }
    });

    rl.on('line', async(line) => {
        const args = [];
        line.match(/"[^"]+"|[\S]+/g).forEach((element) => {
            if (!element) return null;
            return args.push(element.replace(/"/g, ''));
        });
        let cmd = args.shift(); // .toLowerCase();
        try {
            switch (cmd) {
                case ("cls"):
                case ("clear"):
                    clear();
                    break;
                case ("kill"):
                case ("stop"):
                case ("shutdown"):
                    shutdown()
                    break;
                case ("restart"):
                    restart()
                    break;
                case ("execute"):
                    client.send({ action: "command", command: line.slice(cmd.length, line.length) });
                    break;
                default:
                    try { // if there is no built-in command in the interface then just evaluate the entire line
                        console.log("command not found, evaluating...");
                        let eresult = eval(line);
                        console.log(eresult);
                    } catch (err) { console.error(err); }
            }
        } catch (err) { console.error(err); }
    });

    process.on("SIGINT", () => {
        if (client) {
            client.send({ action: "shutdown" });
        }
        process.exit();
    });
}
setupChild()