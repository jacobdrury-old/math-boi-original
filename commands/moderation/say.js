module.exports = {
    name: 'say',
    description: 'Makes the bot say whatever is passed to the cmd',
    moderatorOnly: true,
    category: 'moderation',
    guildOnly: true,
    async execute(message, args) {
        const fakeMsg = await messaage.cannel.send('pls no snipe');
        await message.delete();
        fakeMsg.delete();
        await message.channel.send(args.join(' '));
    },
};