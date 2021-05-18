const lockMsgIds = new Map();

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
                !message.client.ids.opt.ignoredCategories.includes(
                    c.parentID
                ) && c.type != 'category'
        );

        if (args[0] == 'on') return await lock(message, channels);
        else if (args[0] == 'off') return await unlock(message, channels);
    },
};

const lock = async (message, channels) => {
    lockMsgIds.clear();

    const announcementC = message.guild.channels.cache.get(
        message.client.ids.opt.channels.announcement
    );

    for (const [id, channel] of channels) {
        channel
            .updateOverwrite(message.guild.id, {
                SEND_MESSAGES: false,
            })
            .then(() => {
                channel.setName(`${channel.name}🔒`);
            })
            .then(() => {
                if (channel.type != 'voice') {
                    channel
                        .send(
                            `🔒 Channel locked please check ${
                                announcementC || 'the announcements'
                            } for more info 🔒`
                        )
                        .then((msg) => lockMsgIds.set(channel.id, `${msg.id}`))
                        .catch(message.client.logger.error);
                }
            })
            .catch(message.client.logger.error);
    }

    if (announcementC) {
        await announcementC.send('', {
            embed: {
                color: 0xff2c02,
                title: '🔒 Server Locked 🔒',
                description: `The server has been locked by ${message.author}\nPlease be patient while our team resolves the issue!`,
            },
        });
    }

    return message.channel.send('All channels have been locked 🔒');
};

const unlock = async (message, channels) => {
    for (const [id, channel] of channels) {
        channel
            .updateOverwrite(message.guild.id, {
                SEND_MESSAGES: null,
            })
            .then(() => {
                channel.setName(channel.name.replace('🔒', ''));
            })
            .then(() => {
                if (channel.type != 'voice') {
                    channel.messages
                        .fetch(lockMsgIds.get(channel.id))
                        .then((msg) => msg.delete())
                        .catch(message.client.logger.error);
                }
            })
            .catch(message.client.logger.error);
    }

    const announcementC = message.guild.channels.cache.get(
        message.client.ids.opt.channels.announcement
    );

    if (announcementC) {
        await announcementC.send('', {
            embed: {
                color: 0x00f763,
                title: '🔓 Server Unlocked 🔓',
                description: `The server has been unlocked! Thank you for your patience!`,
            },
        });
    }

    return message.channel.send('All channels have been unlocked 🔓');
};
