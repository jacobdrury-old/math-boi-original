module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const guild = message.member.guild;
        await message.channel.send('', {
            embed: {
                color: 0x42648a,
                title: `**Welcome to ${guild.name}!**`,
                thumbnail: {
                    url: guild.iconURL({ dynamic: true }),
                },
                description:
                    `**In order to get help you must first:**\n` +
                    `- Go and read the rules and react with a :white_check_mark:\n\n` +
                    `- Go to the role selection channel and add the subjects you need help with!\n\n` +
                    `- Post your question in the corresponding channel and tag \`@Tutor\``,
            },
        });
    },
};
