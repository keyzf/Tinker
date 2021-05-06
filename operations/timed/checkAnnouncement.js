'use strict';

const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "checkAnnouncement"
});

const { MessageEmbed } = require("discord.js");

op.setExecute(async(client) => {
    // FIXME: announcements needed an overhaul
});
module.exports = op;