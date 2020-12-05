module.exports = {
    name: 'members',
    description: 'Sends member count embed',
    category: 'basic',
    async execute(message) {
        const bots = message.guild.members.cache.filter((m) => m.user.bot);

        const verifiedRole = await message.guild.roles.fetch(
            message.client.ids.roles.verified
        );

        const serverCount = message.guild.memberCount;

        const totalHumans = serverCount - bots.size;
        const verified = verifiedRole.members.size;
        const unverified = totalHumans - verified;

        message.channel.send('', {
            embed: {
                color: 0xa13ef3,
                title: '**Member Count**',
                description: `There are **${serverCount}** members in this server.`,
                thumbnail: { url: message.guild.iconURL({ dynamic: true }) },
                fields: [
                    {
                        name: '**Verified Users**',
                        value: verified,
                        inline: true,
                    },
                    {
                        name: '**Un-Verified Users**',
                        value: unverified,
                        inline: true,
                    },
                    { name: '**Bots**', value: bots.size, inline: true },
                ],
            },
        });
    },
};
