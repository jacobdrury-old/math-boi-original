const { getModLogChannel } = require('../../modules/utils');

module.exports = async (client, inActiveTutors) => {
    const webhookClient = await getModLogChannel();
    if (!webhookClient) return;

    let tutorEmbeds = [];

    try {
        for (const t of inActiveTutors) {
            const member = await client.guilds.cache
                .get(client.guildId)
                .members.fetch(t.discordID);

            if (!member) return;

            tutorEmbeds.push({
                color: 0x2caefe,
                author: {
                    name: `${member.user.username}#${member.user.discriminator}`,
                    icon_url: member.user.displayAvatarURL({
                        dynamic: true,
                    }),
                },
                fields: [
                    {
                        name: 'User Tag',
                        value: member,
                        inline: true,
                    },
                    {
                        name: 'Messages Sent',
                        value: t.subjectMessageCount,
                        inline: true,
                    },
                ],
                timestamp: new Date(),
            });
        }
    } catch (err) {
        client.logger.error(err);
    }

    await webhookClient.send({
        embeds: [
            {
                title: 'Inactive tutors',
                color: 0x2caefe,
                description: `Count: ${tutorEmbeds.length}`,
            },
        ],
    });

    while (tutorEmbeds.length) {
        await webhookClient.send({
            embeds: tutorEmbeds.splice(0, 10),
        });
    }
};
