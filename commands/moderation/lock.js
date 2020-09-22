module.exports = {
    name: 'lock',
    description: 'Locks/Unlocks all channels in the server',
    moderatorOnly: true,
    category: 'moderation',
    guildOnly: true,
    args: true,
    async execute(message, args) {
        const channels = message.guild.channels.cache.filter(
            (c) =>
                !message.client.IGNORED.includes(c.parentID) &&
                c.type != 'category'
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
            .then(() => {
                channel.setName(`${channel.name}🔒`);
            })
            .catch((err) => console.error(err));
    });

    const announcementC = message.guild.channels.cache.get(
        client.channelIds.announcementID
    );
    await announcementC.send('', {
        embed: {
            color: 0xff2c02,
            title: '🔒 Server Locked 🔒',
            description: `The server has been locked by ${message.author}\nPlease be patient while our team resolves the issue!`,
        },
    });

    return message.channel.send('All channels have been locked 🔒');
};

const unlock = async (message, channels) => {
    channels.forEach((channel) => {
        channel
            .updateOverwrite(message.guild.id, {
                SEND_MESSAGES: null,
            })
            .then(() => {
                channel.setName(channel.name.replace('🔒', ''));
            })
            .catch((err) => console.error(err));
    });

    const announcementC = message.guild.channels.cache.get(
        client.channelIds.announcementID
    );
    await announcementC.send('', {
        embed: {
            color: 0x00f763,
            title: '🔓 Server Unlocked 🔓',
            description: `The server has been unlocked! Thank you for your patience!`,
        },
    });

    return message.channel.send('All channels have been unlocked 🔓');
};
