const { getModLogChannel } = require('../../modules/utils');

module.exports = async (client, guild, user) => {
    if (!client.enableLogs) return;
    
    const webhookClient = await getModLogChannel();
    if (!webhookClient) return;

    await webhookClient.send({
        embeds: [
            {
                color: 0xff2c02,
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
                description: `**:man_police_officer: :lock: ${user} was banned**`,
                timestamp: new Date(),
            },
        ],
    });
};
