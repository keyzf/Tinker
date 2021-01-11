const fs = require("fs");
const logger = require("../../lib/logger");
const setResponse = require("../../data/setResponse");

module.exports.run = async(bot, message, args, dbGuild, cmd) => {
    const stream = fs.createWriteStream("./data/todo.txt", {flags:'a'});
    try {
        stream.write("TODO: " + args[0] + "\n");
    } catch (err) {
        logger.error(err)
        return message.channel.send(setResponse.fileIOError())
    }
    stream.close()
    message.channel.send(`\`TODO: ${args[0]}\` added successfully`);
};

module.exports.help = {
    name: 'addtodo',
    aliases: ["todo"],
    description: "add to todo list",
    usage: "\"[whatever you gotta do]\"",
    cooldown: 2,
    limit: true
};