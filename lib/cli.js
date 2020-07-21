const { bot } = require('..');
const logger = require("./logger");
const { db, Fields } = require("./db");

const ms = require("pretty-ms")
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');


module.exports.setup = () => {
    // Read messages from the console.
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', async(line) => {

        const args = [];
        line.match(/"[^"]+"|[\S]+/g).forEach((element) => {
            if (!element) return null;
            return args.push(element.replace(/"/g, ''));
        });
        let cmd = args.shift() // .toLowerCase();
        try {
            switch (cmd) {
                case ("cls"):
                case ("clear"):
                    clear();
                    break;
                case ("sendChannel"):
                    bot.channels.cache.get(args[0]).send(args[1])
                    break;
                case ("uptime"):
                    console.log(ms(bot.uptime));
                    break;
                
                default:
                    try { // if there is no built-in command in the interface then just evaluate the entire line
                        console.log("command not found, evaluating...")
                        let eresult = eval(line);
                        console.log(eresult);
                    } catch (err) { console.error(err) }
            }
        } catch (err) { console.error(err) }
    });
}