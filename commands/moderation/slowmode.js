module.exports = {
    name: 'slowmode',
    description: 'Sets slow mode for the channel cmd is used in',
    moderatorOnly: true,
    category: 'moderation',
    guildOnly: true,
    args: true,
    async execute(message, args) {
        const [time] = args;
        if (!time)
            return await message.channel.send(
                'You did not specify a correct amount of time!'
            );

        if (isNaN(time))
            return await message.channel.send('That is not a number!');

        if (time > 21600)
            return await message.channel.send(
                'Invalid Number! Number must be below 21600.'
            );

        await message.channel.setRateLimitPerUser(time);
        await message.channel.send('', {
            embed: {
                description: `Slowmode set to **${time}** seconds`,
            },
        });
    },
};
