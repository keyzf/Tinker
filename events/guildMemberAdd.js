const { bot } = require('../index');
const config = require("../config/config.json");
const logger = require("../lib/logger");
const { db, Fields } = require("../lib/db");
const Discord = require("discord.js")

const { wrapText } = require("../lib/utilFunctions");
// require canvas
const Canvas = require('canvas');
// get the register font method
const registerFont = Canvas.registerFont;
// register all the necessary fonts (DO NOT CHANGE THE family ATTRIBUTE, ONLY THE FILEPATH)
registerFont('./res/join-card/Montserrat-Bold.ttf', { family: 'mont-bold' })
registerFont('./res/join-card/Montserrat-Medium.ttf', { family: 'mont-med' })
registerFont('./res/join-card/Montserrat-Regular.ttf', { family: 'mont-reg' })
registerFont('./res/join-card/Montserrat-SemiBold.ttf', { family: 'mont-semibold' })

bot.on("guildMemberAdd", async(member) => {
    const dbGuild = db.prepare(`SELECT * FROM guilds WHERE ${Fields.GuildFields.guildID}='${member.guild.id}'`).get()
    bot.event.addUser(member.id, dbGuild);
    if (!dbGuild.welcomeChannel) { return; }

    const canvas = Canvas.createCanvas(400, 660);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./res/join-card/user-card2.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px mont-bold';
    ctx.fillText(`${member.displayName}!`, canvas.width / 2, 290);
    ctx.font = '30px mont-med';
    ctx.fillText(`#${member.user.tag.split("#")[1]}!`, canvas.width / 2, 330);
    ctx.font = '20px mont-semibold';
    ctx.fillText(`${member.user.createdAt.toDateString()}!`, canvas.width / 2, 360);
    ctx.font = '30px mont-reg';
    ctx.textAlign = "left";
    // wrapText(ctx, `Some extreme filler text that is really long to take up as much space as possible hoping for a text wrap`, 65, canvas.height - 210, canvas.width - 85, 30);
    ctx.beginPath();
    ctx.arc((canvas.width / 2), 175, 65, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: "jpg" }));
    ctx.drawImage(avatar, (canvas.width / 2) - 65, 110, 130, 130);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome-image.png");

    bot.channels.cache.get(dbGuild.welcomeChannel).send(`Welcome to the server, ${member}!`, attachment);

});