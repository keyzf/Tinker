const cleanExit = require("./cleanExit")
const { bot } = require("../index")
const logger = require("./logger")

module.exports.setup = () => {
    process.on("message", (msg) => {
        console.log(msg);

        if (msg.action == "command") {
            const args = [];
            msg.command.match(/"[^"]+"|[\S]+/g).forEach((element) => {
                if (!element) return null;
                return args.push(element.replace(/"/g, ''));
            });
            let cmd = args.shift() // .toLowerCase();
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
                        let eresult = eval(msg.command);
                        console.log(eresult);
                    } catch (err) { console.error(err) }
            }
        } else if (msg.action == "shutdown") {
            cleanExit.call();
        }
    });
}