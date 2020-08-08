module.exports = {
    name: 'reset',
    description: 'Clones and deletes original channel',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const originalChannel = message.channel;
        const channels = message.channel.guild.channels;

        const newChannel = await channels.create(originalChannel.name, {
            type: originalChannel.type,
            topic: originalChannel.topic,
            nsfw: originalChannel.nsfw,
            parent: originalChannel.parent,
            permissionOverwrites: originalChannel.permissionOverwrites,
            position: originalChannel.position,
            rateLimitPerUser: originalChannel.rateLimitPerUser,
            reason: 'Cloning and Purging this channel',
        });

        await originalChannel.delete();
        const msg = await newChannel.send('Successfully purged!');

        await sleep(10000);
        await msg.delete();
    },
};

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
