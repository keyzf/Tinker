const logger = require("../../lib/logger");
const botSetup = require("../../lib/shardSetup");
const { find_nested } = require("../../lib/utilFunctions");
const path = require("path")

module.exports.run = async(bot, message, args) => {
    const func = args[0];
    const type = args[1];
    if (type == "event") {
        const eventName = args[2];
        let event_files = find_nested("./events/", `.js`);

        event_files = event_files.filter((f) => { return path.basename(f) === `${eventName}.js` });

        if (!event_files.length) { return message.channel.send("Event file not found"); }
        if (event_files.length > 1) { return message.channel.send("More than one event found"); }
        const scriptName = event_files[0];
        try {
            if (func == "remove" || func == "reload") {
                await botSetup.removeEvent(bot, scriptName);
                message.channel.send(`Removed event ${eventName}`)
            }
            if (func == "add" || func == "reload") {
                await botSetup.addEvent(bot, scriptName);
                message.channel.send(`Added event ${eventName}`)
            }
            
        } catch (err) {
            logger.error(err);
            message.channel.send(`${eventName} event has broken`)
        }
    } else if (type == "shardfunction" || type == "sfunc") {
        const shardFunctionName = args[2];
        let shardFunction_files = find_nested("./shardFunctions/", `.js`);

        shardFunction_files = shardFunction_files.filter((f) => { return path.basename(f) === `${shardFunctionName}.js` });

        if (!shardFunction_files.length) { return message.channel.send("shardFunction file not found"); }
        if (shardFunction_files.length > 1) { return message.channel.send("More than one shardFunction found"); }
        const scriptName = shardFunction_files[0];
        try {
            if (func == "remove" || func == "reload") {
                await botSetup.removeShardFunction(bot, scriptName);
                message.channel.send(`Removed shardFunction ${shardFunctionName}`)
            }
            if (func == "add" || func == "reload") {
                await botSetup.addShardFunction(bot, scriptName);
                message.channel.send(`Added shardFunction ${shardFunctionName}`)
            }
        } catch (err) {
            logger.error(err.stack);
            message.channel.send(`${shardFunctionName} shardFunction has broken`)
        }
    } else if (type == "command") {
        const commandName = args[2];
        let cmd_files = find_nested("./commands/", `.js`);

        cmd_files = cmd_files.filter((f) => { return path.basename(f) === `${commandName}.js` });

        if (!cmd_files.length) { return message.channel.send("Command file not found"); }
        if (cmd_files.length > 1) { return message.channel.send("More than one command found"); }
        const scriptName = cmd_files[0];
        try {
            if (func == "remove" || func == "reload") {
                await botSetup.removeCommand(bot, scriptName);
                message.channel.send(`Removed command ${commandName}`)
            }
            if (func == "add" || func == "reload") {
                await botSetup.addCommand(bot, scriptName);
                message.channel.send(`Added command ${commandName}`)
            }
        } catch (err) {
            logger.error(err);
            message.channel.send(`${commandName} command has broken`)
        }
    } else { return message.channel.send("Type should equal \"command\", \"event\" or \"cevent\"") }
};

module.exports.help = {
    name: "shardmanage",
    aliases: ["smanage"],
    description: "Manages dynamically loaded content for the shard this guild is in",
    usage: "[func] [type] [name]",
    cooldown: 3,
    limit: true
};