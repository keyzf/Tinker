const Operation = require("../..//structures/Operation");
const op = new Operation();

op.setInfo({
    name: "deleteCatch"
});

op.setPerms({
    botPermissions: ["MANAGE_MESSAGES"]
})

op.setExecute(async(client, msg, timeout) => {
    if(!op.checkPerms(msg.guild, msg.channel)) {return;}

    try {
        await msg.delete({timeout: timeout || 0});
        return true;
    } catch (e) {
        client.logger.debug(e);
        return false;
    }
});

module.exports = op;