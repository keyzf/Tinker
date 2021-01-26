(async function() {

    const chalk = require('chalk');
    // const clear = require('clear');
    const figlet = require('figlet');
    // clear();

    await require("./lib/prototypeModification").setup();

    const package = require("./package.json")

    console.log(
        chalk.magenta(
            figlet.textSync(`${package.name.capitalize()}@${package.version}`, { horizontalLayout: 'full' })
        )
    );

    require("dotenv").config();

    const { ShardingManager } = require("discord.js");

    const manager = new ShardingManager("./bot.js", {
        token: process.env.BOT_TOKEN_LIVE,
        totalShards: "auto" // "auto"
    });

    manager.on("shardCreate", (shard) => {
        console.log(`Shard #${shard.id} is being launched`);

        shard.on("ready", () => {
            console.log(`Shard #${shard.id} is ready`);
        });

        shard.on("death", (proc) => {
            console.log(`Shard #${shard.id} dies`);
        });

        shard.on("disconnect", () => {
            console.log(`Shard #${shard.id} disconnected`);
        });

        shard.on("message", (msg) => {
            // console.log(`Shard #${shard.id} ${msg}`);
            // console.log(`Shard[${shard.id}] : ${msg._eval} : ${msg._result}`);
        });

        shard.on("reconnecting", () => {
            console.log(`Shard #${shard.id} is reconnecting`);
        });

        shard.on("spawn", (proc) => {
            console.log(`Shard #${shard.id} spawned`);
        });
    });

    manager.on('message', (shard, message) => {
        console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
    });

    let shards = await manager.spawn();

    // const readline = require('readline');
    // const rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    //     terminal: false
    // });

    // rl.on('line', async(line) => {
    //     const args = [];
    //     line.match(/"[^"]+"|[\S]+/g).forEach((element) => {
    //         if (!element) return null;
    //         return args.push(element.replace(/"/g, ''));
    //     });
    //     let cmd = args.shift(); // .toLowerCase();
    //     try {
    //         switch (cmd) {
    //             case ("shutdown"):
    //                 await killAll(shards);
    //                 process.exit();
    //                 break;
    //             case ("restart"):
    //                 manager.respawnAll();
    //                 break;
    //             case ("execute"):

    //                 break;
    //             default:
    //                 try { // if there is no built-in command in the interface then just evaluate the entire line
    //                     console.log("command not found, evaluating...");
    //                     let eresult = eval(line);
    //                     console.log(eresult);
    //                 } catch (err) { console.error(err); }
    //         }
    //     } catch (err) { console.error(err); }
    // });

}());

// await require("./dashboard/server").setup(bot);
// await require("./dashboard/server").start();