const { getIsModerator, getIsTrainee } = require('../../modules/UserHelpers');

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

        if (getIsTrainee(message.client, message.member) && time > 30)
            return await message.channel.send(
                `Trainee Moderators are limited to 30 second slow mode`
            );

        if (getIsModerator(message.client, message.member) && time > 60)
            return await message.channel.send(
                `Moderators are limited to 60 second slow mode`
            );

        await message.channel.setRateLimitPerUser(time);
        await message.channel.send('', {
            embed: {
                description: `Slowmode set to **${time}** seconds`,
            },
        });
    },
};
