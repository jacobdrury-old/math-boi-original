const { getReactionMessage } = require('../../modules/utils.js');
const { removeRole } = require('../../modules/UserHelpers.js');
module.exports = async (client, messageReaction, user) => {
    if (user.bot) return;
    try {
        const reactionMessage = await getReactionMessage(
            client,
            messageReaction.message.id
        );

        if (!reactionMessage) return;

        const roleId = reactionMessage.reactions.get(
            messageReaction.emoji.name
        );
        if (!roleId) return;

        const member = await client.guilds.cache
            .get(client.guildId)
            .members.fetch(user.id);

        return removeRole(member, roleId, null, false);
    } catch (ex) {
        return;
    }
};
