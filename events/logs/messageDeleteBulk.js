const { getMessageLogChannel } = require('../../modules/utils');

module.exports = async (client, messages) => {
    try {
        if (!client.enableLogs) return;
        if (client.ids.categories.council === message.channel.parentID) return;
        const webhookClient = await getMessageLogChannel();
        if (!webhookClient) return;

        let embeds = [];

        const send = async () => {
            await webhookClient.send({ embeds });
            embeds = [];
        };

        messages.forEach(async (message) => {
            if (embeds.length == 10) {
                await send();
            }

            embeds.push({
                author: {
                    name: `${message.member.user.username}#${message.member.user.discriminator}`,
                    icon_url: message.member.user.displayAvatarURL({
                        dynamic: true,
                    }),
                },
                timestamp: new Date(),
                color: 0xff2c02,
                description: `**:wastebasket: Message sent by ${message.member} deleted in ${message.channel}**\n${message.content}`,
            });
        });

        await send();
    } catch (err) {}
};
