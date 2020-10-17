const logger = require("../../lib/logger");
const botSetup = require("../../lib/botSetup");
const { find_nested } = require("../../lib/utilFunctions");
const path = require("path")

module.exports.run = async(bot, message, args) => {
    const type = args[0];
    if (type == "event") {
        const eventName = args[1];
        let event_files = find_nested("./events/", `.js`);

        event_files = event_files.filter((f) => { return path.basename(f) === `${eventName}.js` });

        if (!event_files.length) { return message.channel.send("Event file not found"); }
        if (event_files.length > 1) { return message.channel.send("More than one event found"); }
        const scriptName = event_files[0];
        try {
            await botSetup.removeEvent(bot, scriptName);
            await botSetup.addEvent(bot, scriptName);
            message.channel.send(`Reloaded event ${eventName}`)
        } catch (err) {
            logger.error(err);
            message.channel.send(`${eventName} event has broken`)
        }
    } else if (type == "cevent") {
        const ceventName = args[1];
        let cevent_files = find_nested("./custom_events/", `.js`);

        cevent_files = cevent_files.filter((f) => { return path.basename(f) === `${ceventName}.js` });

        if (!cevent_files.length) { return message.channel.send("CEvent file not found"); }
        if (cevent_files.length > 1) { return message.channel.send("More than one cevent found"); }
        const scriptName = cevent_files[0];
        try {
            await botSetup.removeCEvent(bot, scriptName);
            await botSetup.addCEvent(bot, scriptName);
            message.channel.send(`Reloaded Cevent ${ceventName}`)
        } catch (err) {
            logger.error(err);
            message.channel.send(`${ceventName} Cevent has broken`)
        }
    } else if (type == "command") {
        const commandName = args[1];
        let cmd_files = find_nested("./commands/", `.js`);

        cmd_files = cmd_files.filter((f) => { return path.basename(f) === `${commandName}.js` });

        if (!cmd_files.length) { return message.channel.send("Command file not found"); }
        if (cmd_files.length > 1) { return message.channel.send("More than one command found"); }
        const scriptName = cmd_files[0];
        try {
            await botSetup.removeCommand(bot, scriptName);
            await botSetup.addCommand(bot, scriptName);
            message.channel.send(`Reloaded command ${commandName}`)
        } catch (err) {
            logger.error(err);
            message.channel.send(`${commandName} command has broken`)
        }
    } else { return message.channel.send("Type should equal \"command\", \"event\" or \"cevent\"") }
};

module.exports.help = {
    name: "reload",
    aliases: ["rl"],
    description: "Reloads an event or command",
    usage: "[type] [name]",
    cooldown: 3,
    limit: true
};