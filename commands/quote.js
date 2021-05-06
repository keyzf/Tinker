'use strict'

const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "quote",
    aliases: [],
    category: "Fun",
    description: "Get an inspirational quote",
    usage: "[\"today\"]"
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.fun.quote"],
    memberPermissions: ["command.fun.quote"]
});

const axios = require("axios");

const baseURL = "https://zenquotes.io/api/";

let quotesCache = []
let todaysQuoteObj = {};

command.setExecute(async(client, message, args, cmd) => {
    const m = await message.channel.send(client.operations.generateEmbed.run({
        title: `${client.emojiHelper.sendWith(client.data.emojis.custom.loading)} Getting info`,
        author: "Tinker's Quotes",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by ", message.author, "")
    }));

    if (args[0] == "today") {
        if (!todaysQuoteObj || !client.timeManager.sameDay(new Date(todaysQuoteObj.time), new Date())) {
            const { data } = await axios({
                method: "GET",
                url: `${baseURL}/today/`,
                headers: { accept: "application/json" }
            }).catch(({ stack }) => {
                client.logger.error(stack);
            });
            client.logger.debug("Daily quote new fetch")
            todaysQuoteObj = data[0];
            todaysQuoteObj.time = Date.now();
        }
        m.edit(client.operations.generateEmbed.run({
            description: `${todaysQuoteObj.q} - \`${todaysQuoteObj.a}\``,
            author: "Tinker's Quotes",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, ` ${client.statics.defaultEmbed.footerSeparator} Today's quote`),
            timestamp: true
        }))
    } else {
        if (quotesCache.length == 0) {
            try {
                const { data } = await axios({
                    method: "GET",
                    url: baseURL + "quotes",
                    headers: { accept: "application/json" }
                });
                quotesCache = data;
                client.logger.debug("Quote Cache fetch new batch")
            } catch ({ stack }) {
                client.logger.error(stack)
            };
        }

        const rand = Math.floor((Math.random() * quotesCache.length))
        m.edit(client.operations.generateEmbed.run({
            description: `${quotesCache[rand].q} - \`${quotesCache[rand].a}\``,
            author: "Tinker's Quotes",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by", message.author, ` ${client.statics.defaultEmbed.footerSeparator} Entry no. ${rand +1}/${quotesCache.length}`),
            timestamp: true
        }))
        quotesCache.splice(rand, 1);
    }
});

module.exports = command;