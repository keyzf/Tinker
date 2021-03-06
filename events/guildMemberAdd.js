'use strict'

const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "guildMemberAdd"
});

const { MessageAttachment } = require("discord.js")

const Canvas = require('canvas');
// get the register font method
const registerFont = Canvas.registerFont;
// register all the necessary fonts (DO NOT CHANGE THE family ATTRIBUTE, ONLY THE FILEPATH)
registerFont('./res/join-card/Montserrat-Bold.ttf', { family: 'mont-bold' })
registerFont('./res/join-card/Montserrat-Medium.ttf', { family: 'mont-med' })
registerFont('./res/join-card/Montserrat-Regular.ttf', { family: 'mont-reg' })
registerFont('./res/join-card/Montserrat-SemiBold.ttf', { family: 'mont-semibold' })

event.setExecute(async(client, member) => {
    const [{ welcomeChannel }] = await client.data.db.query(`select welcomeChannel from guilds where guildID='${member.guild.id}'`);
    client.operations.addUser.run(member.id, member.guild.id);

    if (!welcomeChannel) {
        return;
    }
    const channel = await client.channels.fetch(welcomeChannel);
    if (!channel) {
        return;
    }
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
    const attachment = new MessageAttachment(canvas.toBuffer(), "welcome-image.png");

    channel.send(`Welcome to the server, ${member}!`, attachment);
});


module.exports = event;