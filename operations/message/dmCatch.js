const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "dmCatch"
});

op.setExecute(async(client, user, messageContent) => {
    try {
        await user.send(messageContent);
        return true;
    } catch ({stack}) {
        client.logger.debug(stack);
        return false;
    }
});

module.exports = op;