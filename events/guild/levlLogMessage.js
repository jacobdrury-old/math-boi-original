const { setToRole } = require('../../modules/UserHelpers');

module.exports = async (client, message) => {
    if (!message.author.bot) return;

    const member = message.mentions.members.first();

    //Give honorable to lvl 30+
    if (message.content === `GG ${member}, you just advanced to level 30!`) {
        await setToRole(member, client.ids.roles.lvl30, message.member.id);
    }
};
