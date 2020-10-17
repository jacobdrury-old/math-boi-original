module.exports = {
    name: 'poll',
    description: 'Starts a poll',
    usage: 'What is your favorite food? |Sushi|Mexican|Chinese',
    category: 'basic',
    async execute(message, args) {
        const emojis = [
            '0⃣',
            '1⃣',
            '2⃣',
            '3⃣',
            '4⃣',
            '5⃣',
            '6⃣',
            '7⃣',
            '8⃣',
            '9⃣',
        ];

        const [question, ...pollItems] = args.join(' ').split(/\s?\|\s?/);

        if (!question)
            return message.say(
                'Empty question detected! You do not need a | right after poll.'
            );

        if (pollItems.length > 10) {
            await message.channel.send(
                `Your input: \`${message.content}\`\nYou can only pass up to 10 items`
            );
        }

        let contents = '';
        for (let i = 0; i < pollItems.length; i++) {
            contents += `${emojis[i]} - \`${pollItems[i]}\`\n`;
        }

        const embed = {
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL({ dynamic: true }),
            },
            title: `\`${question}\``,
            description: contents,
            color: 0xfdb515,
        };

        const sentPoll = await message.channel.send('', { embed: embed });
        for (let i = 0; i < pollItems.length; i++) {
            await sentPoll.react(`${emojis[i]}`);
        }

        await message.delete();
    },
};
