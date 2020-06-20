const fs = require("fs");
const logger = require("./logger.js");
const { find_nested } = require("./utilFunctions")


const cmd_files = find_nested("./commands/", ".js");

module.exports.setup = async (bot) => {

    fs.readdir("./events/", (err, files) => {
        if (err) logger.log("error", err);
        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if (jsfiles.length <= 0) return logger.log("warn", "There are no events to load...");
        logger.log("info", `Loading ${jsfiles.length} events...`);
        jsfiles.forEach((f, i) => {
            require(`../events/${f}`);
            logger.log("info", `${i + 1}: ${f} loaded!`);
        });
    });

    
    if (cmd_files.length <= 0) return logger.log("warn", "There are no commands to load...");
    logger.log("info", `LOADING ${cmd_files.length} COMMANDS`)
    cmd_files.forEach((file, i) => {
        const props = require(file);
        bot.commands.set(props.help.name, props);
        props.help.aliases.forEach((alias) => {
            bot.aliases.set(alias, props.help.name);
        });
        logger.log("info", `${i + 1}: ${props.help.name} loaded!`);
    });
    logger.log("info", `LOADED ${cmd_files.length} COMMANDS.`);

};