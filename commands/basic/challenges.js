const { getIsTutor, getIsStaff } = require('../../modules/UserHelpers');

module.exports = {
    name: 'challenge',
    description: 'Tags the corresponding challenge role',
    aliases: ['challenges', 'c'],
    usage: 'Your question',
    category: 'basic',
    guildOnly: true,
    subjectOnlyCoolDown: true,
    cooldown: 1800,
    async execute(message, args) {
        const { mathChallenges, scienceChallenges } =
            message.client.ids.opt.channels;

        const challengeChannels = [mathChallenges, scienceChallenges];

        await message.delete();

        if (!challengeChannels.includes(message.channel.id))
            return await message.channel.send(
                `${message.author} Please do not use this command outside of <#${mathChallenges}> or <#${scienceChallenges}>`
            );

        const { mathChallengesRole, scienceChallengesRole } =
            message.client.ids.opt.roles;

        const challengeRole =
            mathChallenges == message.channel.id
                ? mathChallengesRole
                : scienceChallengesRole;

        const isTutor = getIsTutor(message.client, message.member);

        const isStaff = getIsStaff(message.client, message.member);

        if (!isTutor && !isStaff)
            return await message.channel.send(
                `${message.author} This is a tutor only command.`
            );

        const question = args.join(' ');

        if (!question.length)
            return await message.channel.send(`<@&${challengeRole}>`);

        return await message.channel.send(`<@&${challengeRole}>`, {
            embed: {
                author: {
                    name: `${message.author.username}#${message.author.discriminator}`,
                    icon_url: message.author.displayAvatarURL({
                        dynamic: true,
                    }),
                },
                description: message.content,
            },
        });
    },
};
