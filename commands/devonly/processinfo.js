const pm2 = require('pm2');
const logger = require("../../lib/logger");
const util = require("util");
const fs = require('fs').promises;
const generateDefaultEmbed = require("../../util/generateDefaultEmbed");
const emojis = require("../../data/emoji_list.json");
const { MessageAttachment } = require("discord.js");
const deleteCatch = require('../../util/deleteCatch');

module.exports.run = async(bot, message, args, dbGuild, cmd) => {
    const msg = await message.channel.send(generateDefaultEmbed({title:`${emojis.custom.loading} Fetching Process Info`}))

    pm2.describe('index', async(err, data) => {
        if (err) {
            logger.error(err);
            return msg.edit(`Failed to get pm2 process info\n${err}`);
        }
        try {
            const path = `./temp/${Date.now()}.txt`
            await fs.writeFile(path, util.inspect(data, { showHidden: false, depth: null }));
            const attachment = new MessageAttachment(path);
            await message.channel.send(attachment);
            deleteCatch(msg);
            await fs.unlink(path);
        } catch (err) {
            logger.error(err);
            msg.edit(`An error occurred in the FileSystem process\n${err}`)
        }
    })
};

module.exports.help = {
    name: 'processinfo',
    aliases: [],
    description: "Get process information",
    usage: "",
    cooldown: 5,
    limit: true
};