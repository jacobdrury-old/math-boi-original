module.exports = {
    name: 'say',
    description: 'Makes the bot say whatever is passed to the cmd',
    moderatorOnly: true,
    category: 'moderation',
    guildOnly: true,
    async execute(message, args) {
        await message.delete();
        const str = args.join(' ');

        await message.channel.send(str);
    },
};
