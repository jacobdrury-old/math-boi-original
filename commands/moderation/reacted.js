const rulesChannelId = '725171177235939379';
const rulesMessageId = '740454952442265621';

module.exports = {
    name: 'reacted',
    description: 'Checks if user attempted to react to rules message',
    moderatorOnly: true,
    category: 'moderation',
    guildOnly: true,
    args: false,
    async execute(message, args) {
        const guild = message.client.guilds.cache.get(message.client.guildId);

        if (!guild) return await message.channel.send('Cannot find guild');

        let memberId = '';
        const mention = args[0];
        if (mention && mention.startsWith('<@') && mention.endsWith('>')) {
            const id = mention
                .replace('<@', '')
                .replace('!', '')
                .replace('>', '');
            if (!isNaN(id) && id.length == 18) {
                memberId = id;
            }
        }

        if (memberId === '')
            return await message.channel.send('Please pass a valid user');

        const rulesChannel =
            (await guild.channels.cache.get(rulesChannelId)) || null;

        if (!rulesChannel) {
            return message.reply('I cannot find the rules channel');
        }

        const rulesMessage =
            (await rulesChannel.messages.fetch(rulesMessageId)) || null;

        if (!rulesMessage)
            return message.reply(
                'You must use this command in the same channel as the targeted message'
            );

        const reaction = rulesMessage.reactions.cache.first();

        const allUsers = await getAllUsers(reaction);
        const user = allUsers.includes(memberId);

        return await message.channel.send(
            `<@${memberId}> ${
                user ? 'has' : 'has not'
            } reacted to the rules message`
        );
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
