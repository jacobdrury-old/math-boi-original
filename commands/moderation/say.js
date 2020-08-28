module.exports = {
    name: 'say',
    description: 'Makes the bot say whatever is passed to the cmd',
    moderatorOnly: true,
    category: 'moderation',
    guildOnly: true,
    async execute(message, args) {
        await message.delete();
        const fakeMsg = await message.channel.send('pls no snipe');
        fakeMsg.delete();
        await message.channel.send(args.join(' '));
    },
};
