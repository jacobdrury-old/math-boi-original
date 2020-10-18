const { getModLogChannel } = require('../../modules/utils');

module.exports = async (client, guild, user) => {
    if (!client.enableLogs) return;
    const webhookClient = await getModLogChannel();
    if (!webhookClient) return;

    await webhookClient.send({
        embeds: [
            {
                color: 0x00f763,
                author: {
                    name: `${user.username}#${user.discriminator}`,
                    icon_url: user.displayAvatarURL({
                        dynamic: true,
                    }),
                },
                thumbnail: {
                    url: user.displayAvatarURL({
                        dynamic: true,
                    }),
                },
                description: `**:man_police_officer: :unlock: ${user} was unbanned**`,
                timestamp: new Date(),
            },
        ],
    });
};
