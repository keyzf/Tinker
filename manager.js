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

client.on("restart", (msg) => {
    console.log("Client requested restart");
});

client.on("stop", (msg) => {
    console.log("Client requested stop");
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
                client.send({ action: "shutdown" });
                break;
            case ("restart"):
                client.send({ action: "shutdown" });
                client = fork("index.js");
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