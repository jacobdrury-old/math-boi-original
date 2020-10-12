module.exports = {
    name: 'membercount',
    description: 'Sends member count embed',
    category: 'basic',
    execute(message) {
        const [bots, humans] = message.guild.members.cache.partition(
            (m) => m.user.bot
        );

        message.channel.send('', {
            embed: {
                color: 0xa13ef3,
                title: '**Member Count**',
                description:
                    `There are **${message.guild.memberCount}** members in this server.\n` +
                    `**Humans:** ${humans.array().length}\n` +
                    `**Bots:** ${bots.array().length}\n`,
                thumbnail: { url: message.guild.iconURL({ dynamic: true }) },
            },
        });
    },
};
