module.exports = {
    name: 'reacted',
    description: 'Checks if user attempted to react to rules message',
    moderatorOnly: true,
    category: 'moderation',
    guildOnly: true,
    args: false,
    async execute(message, args) {
        try {
            const guild = message.client.guilds.cache.get(
                message.client.guildId
            );

            if (!guild) return await message.channel.send('Cannot find guild');

            let member = message.mentions.members.first();

            let memberId = member.user.id;

            if (memberId === '')
                return await message.channel.send('Please pass a valid user');

            const rulesChannel =
                (await guild.channels.cache.get(
                    message.client.ids.channels.rules
                )) || null;

            if (!rulesChannel) {
                return message.reply('I cannot find the rules channel');
            }

            const rulesMessage =
                (await rulesChannel.messages.fetch(
                    message.client.ids.messages.rules
                )) || null;

            if (!rulesMessage)
                return message.reply('Could not find rules message');

            const reaction = rulesMessage.reactions.cache.first();

            const allUsers = await getAllUsers(reaction);
            const user = allUsers.includes(memberId);

            return await message.channel.send(
                `<@${memberId}> ${
                    user ? 'has' : 'has not'
                } reacted to the rules message`
            );
        } catch (err) {
            await message.channel.send(err.message);
            message.client.logger.error(err);
        }
    },
};

const getAllUsers = async (reaction) => {
    let entries = [];
    let users = await reaction.users.fetch();
    entries = entries.concat(...users.keys());
    while (users.size === 100) {
        const { id } = users.last();
        users = await reaction.users.fetch({ after: id });
        entries = entries.concat(...users.keys());
    }
    return entries;
};
