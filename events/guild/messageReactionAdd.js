const {
    getReactionMessage,
    isReactionRoleChannel,
} = require('../../modules/utils.js');
const { setToRole } = require('../../modules/UserHelpers.js');
const { isUserTooYoung } = require('../../modules/UserHelpers.js');

module.exports = async (client, messageReaction, user) => {
    try {
        if (user.bot) return;

        if (!isReactionRoleChannel(client, messageReaction)) return;

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

    if (
        reactionMessage.blockedUsers &&
        reactionMessage.blockedUsers.blocked.includes(member.id)
    )
        return;

    let userIsTooYoung = false;

    if (roleId === client.ids.opt.roles.middleSchoolRole) {
        userIsTooYoung = await isUserTooYoung(member);
    }

    if (userIsTooYoung) return;

    if (roleId === client.ids.opt.roles.verified) {
        return client.emit('verified', member);
    }

    const role = await setToRole(member, roleId, null, false);

    return role;
};
