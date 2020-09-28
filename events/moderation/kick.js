const { WebhookClient } = require('discord.js');
const { getLogChannel } = require('../../modules/utils');

module.exports = async (client, messageUrl, member, admin) => {
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
            color: 0xffa500,
            description: `🦶${member} has been kicked!`,
            fields: [
                {
                    name: 'Moderator',
                    value: `${admin}`,
                    inline: true,
                },
                {
                    name: 'Command Usage',
                    value: `[Message](${messageUrl})`,
                    inline: true,
                },
            ],
        };

        await webhookClient.send({ embeds: [embed] });
    }
};
