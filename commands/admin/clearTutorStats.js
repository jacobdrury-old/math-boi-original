const User = require('../../db/models/users');
const topTutor = require('../basic/toptutor').execute;

module.exports = {
    name: 'clearTutorStats',
    description: 'Clears tutor stats',
    guildOnly: true,
    adminOnly: true,
    category: 'admin',
    async execute(message, aClient) {
        const client = message ? message.client : aClient;

        const guild = await (message
            ? message.guild
            : client.guilds.cache.get(client.guildId));

        try {
            if (!message) {
                const announcementC = guild.channels.cache.get(
                    client.ids.channels.staffCommands
                );

                const topFiveTutors = (
                    await topTutor(null, announcementC)
                ).slice(0, 5);

                const generateIndex = (t) => topFiveTutors.indexOf(t) + 1;

                const content = topFiveTutors
                    .map(
                        (tutor) =>
                            `${generateIndex(tutor)}) <@!${tutor.discordID}>: ${
                                tutor.subjectMessageCount
                            } messages`
                    )
                    .join('\n');

                await announcementC.send('', {
                    embed: {
                        title: `Tutors of the Month!`,
                        color: 0x2caefe,
                        description: `Congrats to our tutors of the month!!\n\n${content}`,
                        footer: {
                            text: guild.name,
                            icon_url: guild.iconURL({ dynamic: true }),
                        },
                    },
                });
            }

            const inActiveTutors = await User.find({
                deleted: false,
                guildId: client.guildId,
                verified: true,
                isTutor: true,
                subjectMessageCount: { $lt: 10 },
            }).sort({ subjectMessageCount: -1 });

            await client.emit('logInactiveTutors', inActiveTutors);

            await User.updateMany(
                {
                    deleted: false,
                    guildId: client.guildId,
                    verified: true,
                    isTutor: true,
                },
                {
                    subjectMessageCount: 0,
                }
            );
        } catch (err) {
            console.error(err);
        }
    },
};
