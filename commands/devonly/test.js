const { db } = require("../../lib/db")
const util = require("util")

module.exports.run = async(bot, message, args, dbGuild) => {
  message.channel.send(`Hi ${message.author}`)
};

module.exports.help = {
    name: "test",
    aliases: [""],
    description: "",
    usage: "",
    cooldown: 0,
    limit: true,
    generated: true
};