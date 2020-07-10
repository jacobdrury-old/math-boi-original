const { getReactionMessage } = require('../../modules/utils.js');
const { removeRole } = require('../../modules/UserHelpers.js');
module.exports = async (client, messageReaction, user) => {
    if (user.bot) return;
    if (
        messageReaction.message.channel.id !== '725171177235939379' ||
        messageReaction.message.channel.id !== '729885614492876830'
    )
        return;
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
