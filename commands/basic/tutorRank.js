const User = require('../../db/models/users');

const postfix = {
    1: 'st',
    2: 'nd',
    3: 'rd',
    default: 'th',
};

module.exports = {
    name: 'tutorRank',
    aliases: ['trank'],
    description: 'Sends the rank of the tutor',
    guildOnly: true,
    category: 'basic',
    async execute(message, args) {
        const tutors = await User.find({
            guildId: message.guild.id,
            isTutor: true,
            verified: true,
        }).sort({ subjectMessageCount: -1 });

        let member = message.member.id;
        let tag = `<@${member}>`;

        if (args.length == 1 && message.mentions.members.first()) {
            member = message.mentions.members.first();
            tag = `<@${member.id}>`;
        }

        const tutor = tutors.find((t) => t.discordID == member);

        if (!tutor) {
            return await message.channel.send(`${tag} is not a tutor!`);
        }

        const index = tutors.indexOf(tutor) + 1;

        const rank = `${index}${postfix[index] || postfix['default']}`;

        await message.channel.send('', {
            embed: {
                color: 0x2caefe,
                title: 'Tutor Rank',
                description: `${tag} is ranked **${rank}** out of ${tutors.length} tutors with ${tutor.subjectMessageCount} messages!`,
            },
        });
    },
};
