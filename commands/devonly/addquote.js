const fs = require("fs");
const logger = require("../../lib/logger");
const setResponse = require("../../res/setResponse");
const { quotesdb } = require("../../lib/db");

module.exports.run = async(bot, message, args, dbGuild, cmd) => {

    if (!args[2]) { return message.channel.send(`Not enough arguments provided: ${this.help.usage}`); }

    const by = args[0]
    const quote = args[1]
    const pg = args[2] ==  "t" ? true : false

    quotesdb.insert({
       quote,
        date: new Date().toLocaleDateString("en-UK"),
        by,
        pg
    }).then(async (u) => {
        message.channel.send(`\`${u.by}: \"${u.quote}\" (SFW: ${u.pg})\``);
        const m = await message.channel.send(`ID:${u._id}`);
        m.delete({timeout:5000})
    });

};

module.exports.help = {
    name: 'addquote',
    aliases: [""],
    description: "add to quote list",
    usage: "\"[name]\" \"[whatever you wanna quote]\" \"[t:sfw f:nsfw]\"",
    cooldown: 2,
    limit: true
};