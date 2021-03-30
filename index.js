(async () => {

    require("dotenv").config()
    require("./structures/prototypeModification/process");

    // bot
    const TinkerClient = require("./structures/TinkerClient");

    TinkerClient.registerCommandDir("./commands");
    TinkerClient.registerEventDir("./events");
    TinkerClient.registerOperationsDir("./operations");

    // TODO: register the config, statics etc dirs (not hardcode them)

    TinkerClient.addData("emojis", require("./data/emoji_list.json"));
    TinkerClient.addData("eightBall", require("./data/8ball.json"));
    TinkerClient.addData("botInfo", require("./data/botInfo.json"));
    TinkerClient.addData("permissionsNames", require("./data/permissionsNames.json"));
    TinkerClient.addData("tinkerReviews", require("./data/tinkerReviews.json"));
    TinkerClient.addData("changelog", require("./data/changelog.json"));
    TinkerClient.addData("guildBadges", require("./data/badges/guildBadges.json"));
    TinkerClient.addData("userBadges", require("./data/badges/userBadges.json"));

    await TinkerClient.login(process.env.DISCORD_CLIENT_TOKEN);

    // webserver
    // TODO: webserver disabled for now due to changing database
    // if (process.env.NODE_ENV == "production") {
    //     const server = require("./web/index").setup(TinkerClient);
    // }
})();