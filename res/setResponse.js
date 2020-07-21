const Discord = require("discord.js");

module.exports.noAccessDevCmd = () => {
    return new Discord.MessageEmbed()
        .setTitle("That's A Dev Command!")
        .setAuthor("Our Dev Team")
        .setColor("#a700bd")
        .setDescription("Our dev team leave commands in the bot to allow for easier testing and faster fixes, just for you!\nThese commands don't show up in the help tab and can only be accessed by our devs so you don't need to worry about them")
        .addFields(
            { name: "Something wrong?", value: "If you think this is a mistake you can get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP)" }
        )
        .setFooter("See you around!")
        .setTimestamp();
};

module.exports.inDev = () => {
    return new Discord.MessageEmbed()
        .setTitle("This feature is in development")
        .setAuthor("Our Dev Team")
        .setColor("#a700bd")
        .setDescription("We are constantly adding features and improving current ones. But the way we work is that the bot should be available to everyone with as little downtime as possible. This means that sometimes a feature has to be taken offline to be improved / fixed but the bot is still running just for you.\nIf your lucky this could be a new feature that is almost ready for release!")
        .addFields(
            { name: "Something wrong?", value: "If you think this is a mistake you can get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP)" }
        )
        .setFooter("See you around!")
        .setTimestamp();
};

module.exports.fatalErrorToUser = () => {
    return new Discord.MessageEmbed()
        .setTitle("Uh Oh...")
        .setAuthor("An automated error message")
        .setColor("#a700bd")
        .setDescription("Something has gone terribly wrong. I need you to get in contact with my creators and give them this error code. This is a matter of life and death here!")
        .addFields(
            { name: "My Support Server", value: "[Official Support Server](https://discord.gg/aymBcRP)" },
            { name: "Error code", value: "fO5L-brB-k2B" }
        )
        .setFooter("I might not see you for a while :(")
        .setTimestamp();
}

module.exports.haveIGotCorrectPerms = (code) => {
    return new Discord.MessageEmbed()
        .setTitle("Have I got the correct perms?")
        .setColor("#a700bd")
        .setDescription("I tried to do something that requires permissions and failed. Have I got all the correct permissions? If unsure please apply the administrator permission. This allows me to do everything I need without any extra hassle.")
        .addFields(
            { name: "Something wrong?", value: "If you've applied all the correct permissions and the error still persists you should get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP)" },
            { name: "Error code", value: code }
        )
        .setFooter("See you around!")
        .setTimestamp();
}

module.exports.noDbGuildFound = (code) => {
    return new Discord.MessageEmbed()
        .setAuthor("I can't find this server in my database")
        .setTitle("Was I added when the bot was offline?")
        .setColor("#a700bd")
        .setDescription("I did a quick search in the database and it came up with nothing... There is a very simple explanation, I was offline when you added me, you haven't finished the setup, or I have done goofed")
        .addFields(
            { name: "Try first:", value: "Nothing, try nothing. I should be able to fix this myself by adding you now. I suggest you wait a few seconds and then try again!" },
            { name: "Kick me", value: "If you've tried nothing first, now try kicking and re-inviting me (make sure i'm online though otherwise we are going to have the same issue!)" },
            { name: "Still wrong?", value: "If you've tried all of the above and the error still persists you should get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP)" },
            { name: "Error code", value: code || "no code" }
        )
        .setFooter("See you around!")
        .setTimestamp();
}

module.exports.httpGetError = (code) => {
    return new Discord.MessageEmbed()
        .setAuthor("It wasn't me!")
        .setTitle("An error occured with an external site")
        .setColor("#a700bd")
        .setDescription("I promise you it wasn't me. Something went wrong with an external site / api")
        .addFields(
            { name: "Keeps happening?", value: "Well maybe it was me then... you should get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP)" },
            { name: "Error code", value: code || "no code" }
        )
        .setFooter("See you around!")
        .setTimestamp();
}

module.exports.couldNotSend = (code) => {
    return new Discord.MessageEmbed()
        .setAuthor("Help... I'm stuck")
        .setTitle("I couldn't send a message")
        .setColor("#a700bd")
        .setDescription("Make sure I have read write permissions on all channels (If your unsure give me the admin permission)")
        .addFields(
            { name: "Keeps happening?", value: "Well maybe it was my fault... you should get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP)" },
            { name: "Error code", value: code || "No Code" }
        )
        .setFooter("See you around!")
        .setTimestamp();
}

module.exports.sendSuccessful = () => {
    return new Discord.MessageEmbed()
        .setTitle("Send Successful")
        .setColor("#a700bd")
        .setDescription("Its gone!")
        .setFooter("See you around!")
        .setTimestamp();
}

module.exports.fileIOError = (code) => {
    return new Discord.MessageEmbed()
        .setAuthor("FileIO Error")
        .setTitle("I couldn't complete a file operation")
        .setColor("#a700bd")
        .setDescription("I have definitely messed up. I failed to complete a server side file operation which means whatever you just did probably had no effect.\nThat doesn't mean do it again!! It means contact my devs to get it sorted")
        .addFields(
            { name: "Contact the devs", value: "You should get in contact with us at our [Official Support Server](https://discord.gg/aymBcRP), come armed with screenshots!" },
            { name: "Error code", value: code || "No Code"}
        )
        .setFooter("See you around!")
        .setTimestamp();
}