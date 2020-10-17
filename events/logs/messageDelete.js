const { getMessageLogChannel } = require('../../modules/utils');

module.exports = async (client, message) => {
    try {
        const webhookClient = await getMessageLogChannel();
        if (!webhookClient) return;

        if (!message.member || !message.member.user || message.author.bot)
            return;

        await webhookClient.send({
            embeds: [
                {
                    author: {
                        name: `${message.member.user.username}#${message.member.user.discriminator}`,
                        icon_url: message.member.user.displayAvatarURL({
                            dynamic: true,
                        }),
                    },
                    timestamp: new Date(),
                    color: 0xff2c02,
                    description: `**:wastebasket: Message sent by ${message.member} deleted in ${message.channel}**\n${message.content}`,
                },
            ],
        });
    } catch (ex) {
        console.error(ex);
    }
};
