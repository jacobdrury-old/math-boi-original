const { WebhookClient } = require('discord.js');
const { getLogChannel } = require('../../modules/utils');

module.exports = async (client, member, admin) => {
    const logChannel = await getLogChannel(member.client);
    if (logChannel) {
        const webhookClient = new WebhookClient(
            logChannel.Id,
            logChannel.token
        );
        const embed = {
            author: {
                name: `${member.user.username}#${member.user.discriminator}`,
                icon_url: member.user.displayAvatarURL({ dynamic: true }),
            },
            thumbnail: {
                url: member.user.displayAvatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: 'User',
                    value: `${member}>`,
                    inline: true,
                },
                {
                    name: 'Action',
                    value: `🦶Kicked`,
                    inline: true,
                },
                {
                    name: 'Moderator',
                    value: `${admin}`,
                    inline: true,
                },
            ],
        };

        await webhookClient.send({ embeds: [embed] });
    }
};
