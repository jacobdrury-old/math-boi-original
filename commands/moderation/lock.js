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

        if (args[0] == 'on') {
            await lock(channels);
            return message.channel.send('All channels have been locked 🔒');
        } else if (args[0] == 'off') {
            await unlock(channels);
            return message.channel.send('All channels have been unlocked 🔓');
        }
    },
};

const lock = async (channels) => {
    channels.forEach((channel) => {
        channel
            .updateOverwrite(message.guild.roles.everyone, {
                SEND_MESSAGE: false,
            })
            .then(() => {
                channel.name += '🔒';
            })
            .catch((err) => console.error(err));
    });
};

const unlock = async (channels) => {
    channels.forEach((channel) => {
        channel
            .updateOverwrite(message.guild.roles.everyone, {
                SEND_MESSAGE: null,
            })
            .then(() => {
                channel.name.replace('🔒', '');
            })
            .catch((err) => console.error(err));
    });
};
