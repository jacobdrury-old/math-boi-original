const { getBlockedTutors } = require('../../modules/utils');
module.exports = {
    name: 'getBlockedTutors',
    aliases: ['blockedTutors'],
    description: 'Gets a list of all blocked tutors',
    moderatorOnly: true,
    guildOnly: true,
    category: 'moderation',
    async execute(message) {
        try {
            const blockedTutors = await getBlockedTutors();

            const blocked = blockedTutors.blocked.map(
                (id) => `${blockedTutors.blocked.indexOf(id) + 1}) <@${id}>`
            );

            if (blocked.length === 0) {
                blocked.push('There are no blocked tutors!');
            }

            await message.channel.send('', {
                embed: {
                    title: 'Blocked Tutors',
                    description: blocked.join('\n'),
                },
            });
        } catch (err) {
            await message.channel.send(
                `There was an error running this command`,
                { embed: { description: err.message } }
            );

            message.client.logger.error(err);
        }
    },
};
