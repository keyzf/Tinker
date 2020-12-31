const safeEval = require("notevil");

module.exports.run = async (bot, message, args, dbGuild, cmd) => {
    var code = message.content.slice(dbGuild.prefix.length + cmd.length).trim().replace(/```/g, "").replace("js", "");
    try {
        var output = [];
        const data = await safeEval(code, 
        {
            console: {
                log: function(input){output.push(input)}
            },
            JSON: JSON,
            Array: Array,
            Object: Object
        });
        return message.channel.send(`${message.author} your code finished:\nend return data: \`${data}\`\nOutput logs \`${output.join(", ") || "None"}\``);
    } catch (err) {
        return message.channel.send(`${message.author} your code finished with error:\n\`${err}\`\nOutput logs \`${output.join(", ") || "None"}\``);
    }

};

module.exports.help = {
    name: 'safeeval',
    aliases: ["safeevaluate", "seval"],
    description: "Evaluate using javascript",
    usage: "[js code]",
    cooldown: 5,
    limit: true
};
