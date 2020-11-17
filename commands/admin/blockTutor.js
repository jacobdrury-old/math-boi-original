const { getBlockedTutors } = require('../../modules/utils');
module.exports = {
    name: 'blockTutor',
    description: 'Blocks a user from getting tutor roles',
    guildOnly: true,
    adminOnly: true,
    category: 'admin',
    async execute(message) {
        try {
            const member = message.mentions.members.first();

            const blockedTutors = await getBlockedTutors();

            blockedTutors.blocked.push(member.id);

            await blockedTutors.save();

            await message.channel.send(
                `${member} has been blocked from the tutor roles!`
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
