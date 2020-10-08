module.exports = {
    name: 'tutor',
    description: 'Tags the tutors and posts your question',
    aliases: ['t'],
    usage: 'Your question',
    category: 'basic',
    guildOnly: true,
    subjectOnlyCoolDown: true,
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

        await message.delete();

        if (nonSubjectChannels.includes(message.channel.parentID))
            return await message.channel.send(
                `${message.author} Please do not post questions in non-subject channels`
            );

        if (!question.length)
            return await message.channel.send(
                `<@&${tutor}> Can you please help ${message.author} with their question?`
            );

        if (args.length == 1 && message.mentions.members.first())
            return await message.channel.send(
                `<@&${tutor}> Can you please help ${message.mentions.members.first()} with their question?\n` +
                    `\nAlso don’t forget to use \`${message.client.prefix}tutor\` the next time you post a question!`
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
