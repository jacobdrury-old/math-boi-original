const { getReactionMessage } = require('../../modules/utils.js');
const { removeRole } = require('../../modules/UserHelpers.js');

const rulesId = '725171177235939379';
const roleSelectionId = '740316361032728615';

module.exports = async (client, messageReaction, user) => {
    if (user.bot) return;
    try {
        if (
            messageReaction.message.channel.id !== rulesId &&
            messageReaction.message.channel.id !== roleSelectionId
        )
            return;

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
