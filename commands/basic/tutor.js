const Role = require('../../db/models/roles');

module.exports = {
    name: 'tutor',
    description: 'Tags the tutors and posts your question',
    aliases: ['t'],
    usage: 'Your question',
    category: 'basic',
    guildOnly: true,
    subjectOnlyCoolDown: true,
    cooldown: 1800,
    async execute(message, args) {
        const question = args.join(' ');

        const { nonSubjectCategories } = message.client.ids;

        await message.delete();

        if (nonSubjectCategories.includes(message.channel.parentID))
            return await message.channel.send(
                `${message.author} Please do not post questions in non-subject channels`
            );

        const tutor = await getTutorId(message);

        if (!tutor)
            return await message.channel.send(
                `<@&${message.client.ids.roles.staff}> I cannot find the Tutor role for this channel.`
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

const getTutorId = async (message) => {
    const {
        introMath,
        intermediateMath,
        advancedMath,
        science,
        humanities,
    } = message.client.ids.subjects;

    if (introMath.includes(message.channel.id))
        return (await Role.findOne({ name: 'introMath' })).Id;

    if (intermediateMath.includes(message.channel.id))
        return (await Role.findOne({ name: 'intMath' })).Id;

    if (advancedMath.includes(message.channel.id))
        return (await Role.findOne({ name: 'advMath' })).Id;

    if (science.includes(message.channel.parentID))
        return (await Role.findOne({ name: 'sciTutor' })).Id;

    if (humanities.includes(message.channel.parentID))
        return (await Role.findOne({ name: 'humTutor' })).Id;
};
