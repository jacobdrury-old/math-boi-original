const { newUserEmbed } = require('../../modules/embeds');

const { getUserLogChannel } = require('../../modules/utils');

module.exports = async (client, oldState, newState) => {
    const oldChannelId = oldState.channelID;
    const newChannelId = newState.channelID;

    const webhookClient = await getUserLogChannel();
    if (!webhookClient) return;

    //User joins a vc
    if (!oldChannelId && newChannelId) {
        return await webhookClient.send({
            embeds: [
                {
                    author: {
                        name: `${newState.member.user.username}#${newState.member.user.discriminator}`,
                        icon_url: newState.member.user.displayAvatarURL({
                            dynamic: true,
                        }),
                    },
                    timestamp: new Date(),
                    color: 0x00f763,
                    description: `:inbox_tray: ${newState.member} joined voice channel \`${newState.channel.name}\``,
                },
            ],
        });
        //User leaves a vc
    } else if (oldChannelId) {
        return await webhookClient.send({
            embeds: [
                {
                    author: {
                        name: `${oldState.member.user.username}#${oldState.member.user.discriminator}`,
                        icon_url: oldState.member.user.displayAvatarURL({
                            dynamic: true,
                        }),
                    },
                    timestamp: new Date(),
                    color: 0xff2c02,
                    description: `:outbox_tray: ${oldState.member} left voice channel \`${oldState.channel.name}\``,
                },
            ],
        });
    }
};