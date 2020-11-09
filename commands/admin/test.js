module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const guild = message.guild;
        const emojis = ['❌', '✅'];
        const [x, check] = emojis;

        const embed = {
            color: 0x2caefe,
            author: {
                name: 'Ticket Confirmation',
                icon_url: guild.iconURL({ dynamic: true }),
            },
            title: 'Please confirm the opening of a new ticket',
            description:
                `__**If you are trying to get help with school work please read the #welcome channel and cancel this ticket.**__\n\n` +
                `*Tickets are only for contacting staff about issues or questions concerning ${guild.name}.*\n`,
            fields: [
                {
                    name: 'Cancel',
                    value: `${x} to cancel ticket`,
                    inline: true,
                },
                {
                    name: 'Confirm',
                    value: `${check} to contact staff`,
                    inline: true,
                },
            ],
            timestamp: new Date(),
            footer: {
                text: guild.name,
            },
        };

        await message.channel.send('', { embed: embed });
    },
};
