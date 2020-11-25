const lockMsgIds = [];

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
                !message.client.ids.ignoredCategories.includes(c.parentID) &&
                c.type != 'category'
        );

        if (args[0] == 'on') return await lock(message, channels);
        else if (args[0] == 'off') return await unlock(message, channels);
    },
};

const lock = async (message, channels) => {
    const announcementC = message.guild.channels.cache.get(
        message.client.ids.channels.announcement
    );

    channels.forEach((channel) => {
        channel
            .updateOverwrite(message.guild.id, {
                SEND_MESSAGES: false,
            })
            .then(() => {
                channel.setName(`${channel.name}🔒`);
            })
            .then(() => {
                channel
                    .send(
                        `Channel locked please check ${announcementC} for more info`
                    )
                    .then((msg) => lockMsgIds.push(msg.id))
                    .catch(console.error);
            })
            .catch(console.error);
    });

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
            .then(() => {
                channel.messages
                    .fetch(lockMsgIds.first())
                    .then((msg) => msg.delete())
                    .then(() => lockMsgIds.shift())
                    .catch(console.error);
            })
            .catch(console.error);
    });

    const announcementC = message.guild.channels.cache.get(
        client.ids.channels.announcement
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
