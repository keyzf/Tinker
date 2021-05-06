'use strict';

const Operation = require("../..//structures/Operation");
const op = new Operation();

op.setInfo({
    name: "deleteCatch"
});

op.setPerms({
    botPermissions: ["MANAGE_MESSAGES"]
})

op.setExecute(async(client, msg, timeout) => {
    if(msg.author.id !== client.user.id) {
        if(!op.checkPerms(msg.guild)) {return;}
    }

    try {
        await msg.delete({timeout: timeout || 0});
        return true;
    } catch ({stack}) {
        client.logger.debug(stack);
        return false;
    }
});

module.exports = op;