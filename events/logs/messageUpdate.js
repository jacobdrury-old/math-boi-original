const { getMessageLogChannel } = require('../../modules/utils');
module.exports = async (client, oldMessage, newMessage) => {
    if (!client.enableLogs) return;
    if (client.ids.categories.council === oldMessage.channel.parentID) return;
    if (newMessage.channel.parentID === client.ids.categories.modMail) return;

    const webhookClient = await getMessageLogChannel();
    if (!webhookClient) return;

    oldMessage = await (oldMessage.partial ? oldMessage.fetch() : oldMessage);
    newMessage = await (newMessage.partial ? newMessage.fetch() : newMessage);

    if (newMessage.author.bot || oldMessage.author.bot) return;

    if (isLatex(oldMessage.content, newMessage.content)) return;

    await webhookClient.send({
        embeds: [
            {
                author: {
                    name: `${newMessage.member.user.username}#${newMessage.member.user.discriminator}`,
                    icon_url: newMessage.member.user.displayAvatarURL({
                        dynamic: true,
                    }),
                },
                timestamp: new Date(),
                color: 0xffa500,
                description: `**📝 [Message](${newMessage.url}) sent by ${newMessage.member} edited in ${newMessage.channel}**`,
                fields: [
                    {
                        name: 'Old message',
                        value: oldMessage.content,
                        inline: false,
                    },
                    {
                        name: 'New message',
                        value: newMessage.content,
                        inline: false,
                    },
                ],
            },
        ],
    });
};

const isLatex = (oldContent, newContent) => {
    return (
        oldContent.startsWith('$') &&
        oldContent.endsWith('$') &&
        newContent.startsWith('$') &&
        newContent.endsWith('$')
    );
};
