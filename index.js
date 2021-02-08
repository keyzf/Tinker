require("dotenv").config()
require("./structures/prototypeModification/string");

const TinkerClient = require("./structures/TinkerClient");

TinkerClient.registerCommandDir("./commands");
TinkerClient.registerEventDir("./events");
TinkerClient.registerOperationsDir("./operations");

TinkerClient.applyConfig("config", require("./config/config.json"));
TinkerClient.applyConfig("officialServer", require("./config/officialServer.json"));
TinkerClient.applyConfig("devs", require("./config/devs.json"));

TinkerClient.addData("emojis", require("./data/emoji_list.json"));
TinkerClient.addData("eightBall", require("./data/8ball.json"));
TinkerClient.addData("botInfo", require("./data/botInfo.json"));
TinkerClient.addData("permissionsNames", require("./data/permissionsNames.json"));

TinkerClient.login(process.env.DISCORD_CLIENT_TOKEN);