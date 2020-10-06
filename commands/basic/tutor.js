module.exports = {
    name: 'tutor',
    description: 'Tags the tutors and posts your question',
    aliases: ['t'],
    usage: 'Your question',
    category: 'basic',
    guildOnly: true,
    cooldown: 600,
    async execute(message, args) {
        const question = args.join(' ');
        const { tutor } = message.client.roleIds;

        const {
            general,
            hobbies,
            honorable,
            music,
            voice,
        } = message.client.categoryIds;

        const nonSubjectChannels = [general, hobbies, honorable, music, voice];

        if (nonSubjectChannels.includes(message.channel.parentID))
            return await message.channel.send(
                `${message.author} Please do not post questions in non-subject channels`
            );

        if (!question.length)
            return await message.channel.send(
                `<@&${tutor}> Can you please help ${message.author} with their question?`
            );

        return await message.channel.send(
            `<@&${tutor}> Can you please help ${message.member}?`,
            {
                embed: {
                    author: {
                        name: `${message.author.username}#${message.author.discriminator}`,
                        icon_url: message.author.displayAvatarURL({
                            dynamic: true,
                        }),
                    },
                    description: question,
                },
            }
        );
    },
};
