module.exports = {
    name: 'getHelp',
    description:
        'Lets people know how to get help with questions in the server',
    moderatorOnly: true,
    guildOnly: true,
    category: 'moderation',
    execute(message, args) {
        let memberTag = '';
        const mention = args[0];
        if (mention && mention.startsWith('<@') && mention.endsWith('>')) {
            memberTag = `${mention} `;
        }

        message.channel.send(
            `${memberTag}To get help with a question please go to <#729885614492876830> and add the subject you need help with.\n\nGo to the corresponding channel and post your question! Make sure you tag \`@Tutor\` so they can get notified of your question!`
        );
    },
};
