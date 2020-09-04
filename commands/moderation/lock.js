const IGNORED = new Set([
    '737457798123880509',
    '730264204174688288',
    '725171177235939378',
    '725178491494072381',
    '725172886821666898',
    '740086491069546537',
]);

module.exports = {
    name: 'lock',
    description: 'Locks/Unlocks all channels in the server',
    moderatorOnly: true,
    category: 'moderation',
    guildOnly: true,
    args: true,
    async execute(message, args) {
        const channels = message.guild.channels.cache.filter(
            (c) => !IGNORED.has(c.parentID) && c.type != 'category'
        );

        if (args[0] == 'on') return await lock(message, channels);
        else if (args[0] == 'off') return await unlock(message, channels);
    },
};

const lock = async (message, channels) => {
    channels.forEach((channel) => {
        channel
            .updateOverwrite(message.guild.id, {
                SEND_MESSAGES: false,
            })
            .then((channel) => {
                channel.setName((channel.name += '🔒'));
            })
            .catch((err) => console.error(err));
    });
    return message.channel.send('All channels have been locked 🔒');
};

const unlock = async (message, channels) => {
    channels.forEach((channel) => {
        channel
            .updateOverwrite(message.guild.id, {
                SEND_MESSAGES: null,
            })
            .then((channel) => {
                channel.setName(channel.name.replace('🔒', ''));
            })
            .catch((err) => console.error(err));
    });
    return message.channel.send('All channels have been unlocked 🔓');
};
