const { getUserLogChannel } = require('../../modules/utils');

module.exports = async (client, member) => {
    const webhookClient = await getUserLogChannel();
    if (!webhookClient) return;

    await webhookClient.send({
        embeds: [
            {
                color: 0xff2c02,
                author: {
                    name: `${member.user.username}#${member.user.discriminator}`,
                    icon_url: member.user.displayAvatarURL({
                        dynamic: true,
                    }),
                },
                thumbnail: {
                    url: member.user.displayAvatarURL({
                        dynamic: true,
                    }),
                },
                description: `**:outbox_tray: ${member} left the server**`,
                timestamp: new Date(),
                footer: {
                    text: `User ID: ${member.id}`,
                },
            },
        ],
    });
};
