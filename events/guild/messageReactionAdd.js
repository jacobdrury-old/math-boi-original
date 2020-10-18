const { getReactionMessage } = require('../../modules/utils.js');
const { setToRole } = require('../../modules/UserHelpers.js');
const { isUserTooYoung } = require('../../modules/UserHelpers.js');

module.exports = async (client, messageReaction, user) => {
    try {
        if (user.bot) return;
        if (
            messageReaction.message.channel.id !== client.ids.channels.rules &&
            messageReaction.message.channel.id !==
                client.ids.channels.roleSelection &&
            messageReaction.message.channel.id !==
                client.ids.channels.tutorRoleSelection
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

    let userIsTooYoung = false;
    if (
        roleId === client.ids.roles.middleSchoolRole &&
        user.id != '579090190690156584'
    ) {
        userIsTooYoung = await isUserTooYoung(member);
    }

    if (userIsTooYoung) return;

    const role = await setToRole(member, roleId, null, false);

    if (role.id === client.ids.roles.verified) {
        client.emit('welcome', member);
    }

    return role;
};
