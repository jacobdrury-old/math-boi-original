const User = require('../../db/models/users');
const { getIsTutor } = require('../../modules/UserHelpers');

module.exports = async (client, message, member) => {
    const isTutor = getIsTutor(client, member);

    if (!isTutor) return;

    if (message.content.length < 5) return;

    await User.findOneAndUpdate(
        {
            deleted: false,
            guildId: message.guild.id,
            discordID: member.id,
            isTutor: true,
            verified: true,
        },
        { $inc: { subjectMessageCount: 1 } }
    );
};
