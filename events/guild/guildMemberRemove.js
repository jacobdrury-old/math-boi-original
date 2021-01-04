const User = require('../../db/models/users');

module.exports = async (client, member) => {
    client.emit('guildMemberJoins', member);

    const user = await User.findOneAndUpdate(
        {
            deleted: false,
            guildId: client.guildId,
            verified: true,
            discordID: member.user.id,
        },
        {
            deleted: true,
        }
    );

    await user.save();
};
