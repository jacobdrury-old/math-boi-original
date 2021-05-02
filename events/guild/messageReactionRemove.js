const {
    getReactionMessage,
    isReactionRoleChannel,
} = require('../../modules/utils.js');
const { removeRole } = require('../../modules/UserHelpers.js');

module.exports = async (client, messageReaction, user) => {
    if (user.bot) return;
    try {
        if (!isReactionRoleChannel(client, messageReaction)) return;

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

        if (
            reactionMessage.blockedUsers &&
            reactionMessage.blockedUsers.blocked.includes(member.id)
        )
            return;

        return removeRole(member, roleId, null, false);
    } catch (ex) {
        client.logger.error(ex);
        return;
    }
};
