const { getBlockedTutors } = require('../../modules/utils');
module.exports = {
    name: 'unblockTutor',
    description: 'Blocks a user from getting tutor roles',
    guildOnly: true,
    adminOnly: true,
    category: 'admin',
    async execute(message) {
        try {
            const member = message.mentions.members.first();

            const blockedTutors = await getBlockedTutors();

            const index = blockedTutors.blocked.indexOf(member.id);

            blockedTutors.blocked.splice(index);

            await blockedTutors.save();

            await message.channel.send(
                `${member} has been unblocked from the tutor roles!`
            );
        } catch (err) {
            await message.channel.send(
                `There was an error running this command`,
                { embed: { description: err.message } }
            );

            console.error(err);
        }
    },
};
