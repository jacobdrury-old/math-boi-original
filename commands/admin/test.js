module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const emojis = ['❌', '✅'];
        const [x, check] = emojis;

        const embed = {
            color: 0x2caefe,
            author: {
                name: 'Ticket Confirmation',
                icon_url: message.guild.iconURL({ dynamic: true }),
            },
            title: 'Please confirm the opening of a new ticket',
            description: `__**If you are trying to get help with school work please read the #welcome channel and cancel this ticket.**__\n\n`,
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
                text: message.guild.name,
            },
        };

        const embedMessage = await message.channel.send('', { embed: embed });

        emojis.forEach(async (emoji) => await embedMessage.react(emoji));

        const filter = (reaction, user) =>
            emojis.includes(reaction.emoji.name) && !user.bot;

        try {
            const collected = await embedMessage.awaitReactions(filter, {
                max: 1,
                time: 3.6e6,
                errors: ['time'],
            });

            const reaction = collected.first();

            if (reaction.emoji.name === x) {
                await embedMessage.edit('', {
                    embed: {
                        color: 0xf0131e,
                        title: 'Canceled',
                        description: 'I have cancelled your ticket!',
                        timestamp: new Date(),
                        footer: {
                            text: message.guild.name,
                            icon_url: message.guild.iconURL({ dynamic: true }),
                        },
                    },
                });

                return false;
            } else if (reaction.emoji.name === check) {
                await embedMessage.reactions.removeAll();

                await embedMessage.edit('', {
                    embed: {
                        color: 0x00f763,
                        title: 'Ticket Opened',
                        description:
                            'I have submitted your ticket! Please wait while one of our staff members gets back to you.',
                        timestamp: new Date(),
                        footer: {
                            text: message.guild.name,
                            icon_url: message.guild.iconURL({ dynamic: true }),
                        },
                    },
                });

                return true;
            }
        } catch (err) {
            await embedMessage.edit('', {
                embed: {
                    color: 0xf0131e,
                    title: 'Timed out',
                    description:
                        'Your request has timed out and the ticket has been cancelled. Please try again!',
                    timestamp: new Date(),
                    footer: {
                        text: message.guild.name,
                        icon_url: message.guild.iconURL({ dynamic: true }),
                    },
                },
            });

            return false;
        }
    },
};
