const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "onthisday",
    aliases: ["otd"],
    category: "Fun",
    description: "What happened today?",
    usage: ""
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["indev.command.fun.onthisday"],
    memberPermissions: ["command.fun.onthisday"]
});

const axios = require("axios");
const TurndownService = require('turndown')
const tds = new TurndownService();

const baseURL = "https://apizen.date/api/"

let todaysRequests = []
let todaysRequestTimestamp = 0;

command.setExecute(async(client, message, args, cmd) => {
    const m = await message.channel.send(client.operations.generateEmbed.run({
        title: `${client.emojiHelper.sendWith(client.data.emojis.custom.loading)} Getting info`,
        author: "Tinker's Time Capsules",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by ", message.author, "")
    }));

    const today = new Date();
    const todayEndURL = `${today.getMonth()+1}/${today.getDate()}/`
    axios({
        method: "GET",
        url: baseURL + todayEndURL,
        headers: { accept: "application/json" }
    }).then(({ data }) => {
        const rand = Math.floor((Math.random() * data.data.Events.length))
        m.edit(client.operations.generateEmbed.run({
            title: `On ${today.toLocaleDateString()}`,
            description: tds.turndown(data.data.Events[rand].html),
            author: "Tinker's Time Capsules",
            colour: client.statics.colours.tinker,
            ...client.statics.defaultEmbed.footerUser("Requested by ", message.author, ` ${client.statics.defaultEmbed.footerSeparator} Entry no. ${rand + 1}/${data.data.Events.length}`)
        }))
    }).catch(({ stack }) => {
        client.logger.error(stack)
    })
});

module.exports = command;