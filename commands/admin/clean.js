const { WebhookClient } = require('discord.js');
const { getLogChannel } = require('../../modules/utils.js');

module.exports = {
    name: 'clean',
    description: 'Deletes the past 10 messages',
    usage: '<number of messages to delete>',
    aliases: ['clear', 'prune'],
    helpDesk: true,
    adminOnly: true,
    category: 'admin',
    guildOnly: true,
    async execute(message, args) {
        let amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            amount = 10;
        } else if (amount <= 1 || amount > 100) {
            return message.reply(
                'You need to input a number between 1 and 99.'
            );
        }

        message.channel.bulkDelete(amount, true).catch((err) => {
            console.error(err);
            message.channel.send(
                'There was an error trying to prune messages in this channel!'
            );
        });

        const member = message.member;
        const logChannel = await getLogChannel(message.client);
        if (logChannel) {
            const webhookClient = new WebhookClient(
                logChannel.Id,
                logChannel.token
            );
            const embed = {
                author: {
                    name: `Clean Command Executed`,
                    icon_url: member.user.displayAvatarURL({ dynamic: true }),
                },
                color: 0xa13ef3,
                fields: [
                    {
                        name: 'Moderator',
                        value: `${member}`,
                        inline: true,
                    },
                    {
                        name: 'Channel',
                        value: `${message.channel}`,
                        inline: true,
                    },
                    {
                        name: 'Messages Cleaned',
                        value: amount - 1,
                        inline: true,
                    },
                ],
            };

            await webhookClient.send({ embeds: [embed] });
        }
    },
};
