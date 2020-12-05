const User = require('../../db/models/users');

module.exports = {
    name: 'topTutor',
    description: 'Sends the top 20 tutor leader board',
    guildOnly: true,
    category: 'basic',
    async execute(message) {
        const tutors = await User.find({
            guildId: message.guild.id,
            isTutor: true,
            verified: true,
        }).sort({ subjectMessageCount: -1 });

        const generateIndex = (tutor) => tutors.indexOf(tutor) + 1;

        const content = tutors
            .map(
                (tutor) =>
                    `${generateIndex(tutor)}) ${
                        tutor.username.split('#')[0]
                    } (${tutor.subjectMessageCount} messages)`
            )
            .slice(0, 10)
            .join('\n');

        await message.channel.send('', {
            embed: {
                color: 0x2caefe,
                title: 'Top 10 Tutors!',
                description: content,
                footer: {
                    text: message.guild.name,
                    icon_url: message.guild.iconURL({ dynamic: true }),
                },
            },
        });
    },
};
