module.exports = {
    name: 'getHelp',
    aliases: ['gh', 'gethelp'],
    description:
        'Lets people know how to get help with questions in the server',
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
            `${memberTag}To get help with a question please go to <#740316361032728615> and add the subject you need help with.\n\nGo to the corresponding channel and post your question! Make sure you use the \`${message.client.prefix}tutor\` command so they can get notified of your question!`
        );

        await message.delete();
    },
};
