const User = require('../../db/models/users');

module.exports = {
    name: 'clearTutorStats',
    description: 'Clears tutor stats',
    guildOnly: true,
    adminOnly: true,
    category: 'admin',
    async execute(message, aClient) {
        const client = message ? message.client : aClient;

        try {
            const inActiveTutors = await User.find({
                guildId: client.guildId,
                verified: true,
                isTutor: true,
                subjectMessageCount: { $lt: 10 },
            }).sort({ subjectMessageCount: -1 });

            await client.emit('logInactiveTutors', inActiveTutors);

            await User.updateMany(
                {
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
