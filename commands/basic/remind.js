module.exports = {
    name: 'remind',
    aliases: ['r'],
    description: 'Lets people know how to tag tutors when they as a question',
    guildOnly: true,
    category: 'basic',
    async execute(message, args) {
        let memberTag = '';
        const mention = args[0];
        if (mention && mention.startsWith('<@') && mention.endsWith('>')) {
            const id = mention
                .replace('<@', '')
                .replace('!', '')
                .replace('>', '');
            if (!isNaN(id) && id.length == 18) {
                memberTag = `${mention} `;
            }
        }

        await message.channel.send(
            `${memberTag}Don’t forget to use \`${message.client.prefix}tutor\` the next time you post a question`
        );

        await message.delete();
    },
};
