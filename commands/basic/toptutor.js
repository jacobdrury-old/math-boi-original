const User = require('../../db/models/users');
module.exports = {
    name: 'topTutor',
    description: 'Sends the top 20 tutor leader board',
    guildOnly: true,
    category: 'basic',
    async execute(message, aChannel) {
        const channel = message ? message.channel : aChannel;
        const guild = message ? message.guild : aChannel.guild;

        const tutors = await User.find({
            deleted: false,
            guildId: guild.id,
            isTutor: true,
            verified: true,
        }).sort({ subjectMessageCount: -1 });

        const generateIndex = (tutor) => tutors.indexOf(tutor) + 1;

        const content = tutors
            .slice(0, 10)
            .map(
                (tutor) =>
                    `${generateIndex(tutor)}) <@!${tutor.discordID}>: ${
                        tutor.subjectMessageCount
                    } messages`
            )
            .join('\n');

        const embed = {
            color: 0x2caefe,
            title: 'Top 10 Tutors!',
            description: content,
            footer: {
                text: guild.name,
                icon_url: guild.iconURL({ dynamic: true }),
            },
        };

        if (message)
            await channel.send('', {
                embed,
            });

        return tutors;
    },
};
