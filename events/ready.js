const DiscordEvent = require("../structures/DiscordEvent");

const event = new DiscordEvent();

event.setInfo({
    name: "ready"
});

event.setExecute((client) => {
    client.logger.info(`Logged in as ${client.user.username}`);
    client.logger.info("Bot online! Setup still running...");
    client.logger.info(`Info: ${client.users.cache.size} users, ${client.channels.cache.size} channels, ${client.guilds.cache.size} guilds.`); 
    
    client.updater.start();

    client.operations.get("updateActivity")();
    client.logger.info(`Setup complete and functional`);
    process.send("ready");
});


module.exports = event;