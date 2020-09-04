module.exports = {
    name: 'say',
    description: 'Makes the bot say whatever is passed to the cmd',
    moderatorOnly: true,
    category: 'moderation',
    guildOnly: true,
    args: true,
    async execute(message, args) {
        await message.delete();
        await message.channel.send(args.join(' '));
    },
};
