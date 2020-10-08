const { WebhookClient } = require('discord.js');
const { getLogChannel } = require('../../modules/utils');

module.exports = async (client, messageUrl, member, admin, time) => {
    const logChannel = await getLogChannel(client);
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
            color: 0xff2c02,
            description: `👮‍♂️🔒 ${member} has been temp banned!`,
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
                {
                    name: 'Time',
                    value: `${time} Days`,
                    inline: true,
                },
            ],
        };

        await webhookClient.send({ embeds: [embed] });
    }
};
