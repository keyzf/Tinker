const Operation = require(`../../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "wanderingWorker"
});

let count = 0
let num = (Math.floor(Math.random() * 15) + 15)

op.setExecute(async(client, force) => {
    if (!force) {
        count++;

        if (count % num != 0) { return; }
    }
    const channel = await client.channels.fetch(client.config.officialServer.lounge_text);
    // const channel = await client.channels.fetch("807174238644862986");//test channel
    setTimeout(async() => {
        const msg = await channel.send(`A wandering worker has stumbled upon us, he picks one person to work for him.\nReact for a chance to earn some money.`);
        await msg.react(client.emojiHelper.reactWith(client.data.emojis.custom.copperCoin));

        msg.createReactionCollector(
                (reaction, u) => {
                    return reaction.emoji.id === client.emojiHelper.reactWith(client.data.emojis.custom.copperCoin)
                }, { time: 15000 })
            .on('end', async collected => {
                client.operations.deleteCatch.run(msg, 0);
                if (!collected.first()) { return }
                let user = collected.first().users.cache.random();
                while (user.bot) { user = collected.first().users.cache.random(); }

                const coinsToAdd = Math.floor(Math.random() * 30)
                channel.send(`The Wandering Worker picked you ${user.username}#${user.discriminator}\nYou were rewarded with \`${coinsToAdd}\` copper coins`).then((m) => client.operations.deleteCatch.run(m, 5000))

                let [{currencyUnit0: coins}] = await client.data.db.query(`select currencyUnit0 from globalUser where userID='${user.id}'`);
                coins += coinsToAdd;
                await client.data.db.query(`update globalUser set currencyUnit0=? where userID=${user.id}`, [coins]);
            });
    }, Math.floor(Math.random() * 1000 * 30))
    num = (Math.floor(Math.random() * 15) + 15)
});

module.exports = op;