const { getReactionMessage } = require('../../modules/utils.js');
const { setToRole } = require('../../modules/UserHelpers.js');
const verifiedRoleId = '729871004368633936';

const rulesId = '725171177235939379';
const roleSelectionId = '740316361032728615';

module.exports = async (client, messageReaction, user) => {
    try {
        if (user.bot) return;
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

        if (reactionMessage.reactions)
            return await roleAssignment(
                client,
                reactionMessage,
                messageReaction,
                user
            );
    } catch (ex) {
        return;
    }
};

const roleAssignment = async (
    client,
    reactionMessage,
    messageReaction,
    user
) => {
    const roleId = reactionMessage.reactions.get(messageReaction.emoji.name);
    if (!roleId) return;
    const member = await client.guilds.cache
        .get(client.guildId)
        .members.fetch(user.id);

    const role = await setToRole(member, roleId, null, false);

    if (role.id === verifiedRoleId) {
        client.emit('welcome', member);
    }

    return role;
};
