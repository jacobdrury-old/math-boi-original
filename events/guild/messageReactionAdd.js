const { getReactionMessage } = require('../../modules/utils.js');
const { setToRole } = require('../../modules/UserHelpers.js');
module.exports = async (client, messageReaction, user) => {
    try {
        if (user.bot) return;
        if (
            messageReaction.message.channel.id !== '725171177235939379' &&
            messageReaction.message.channel.id !== '729885614492876830'
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

    return setToRole(member, roleId, null, false);
};
