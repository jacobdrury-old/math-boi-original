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
        const channels = message.guild.channels.cache;
        console.log(channels);

        if (args[0] == 'on') return await lock();
        else if (args[0] == 'off') return await unlock();
    },
};

const lock = async (channels) => {};

const unlock = async (channels) => {};
