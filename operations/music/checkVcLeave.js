const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "checkVcLeave"
});

op.setExecute(async(client) => {

    const keys = [...client.audioQueue.keys()];
    loop1:
        for (let key = 0; key < keys.length; key++) {
            const queue = client.audioQueue.get(keys[key]);
            
            if (queue.voiceChannel.members.size <= 1) {
                queue.playing = false;
                queue.textChannel.send(await client.operations.generateEmbed.run({
                    title: "Goodbye!",
                    description: "Everyone left me hear alone :( ",
                    author: "Tinker's Tunes",
                    authorUrl: "./res/TinkerMusic-purple.png",
                    colour: client.statics.colours.tinker
                }));
                queue.voiceChannel.leave();
                continue loop1;
            }

            if (!queue.playing) {
                queue.textChannel.send(await client.operations.generateEmbed.run({
                    title: "Goodbye!",
                    description: "No one has played anything for a while",
                    author: "Tinker's Tunes",
                    authorUrl: "./res/TinkerMusic-purple.png",
                    colour: client.statics.colours.tinker
                }));
                queue.voiceChannel.leave();
                continue loop1;
            }
        }
});

module.exports = op;