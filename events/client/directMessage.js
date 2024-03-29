const ModMail = require('../../classes/ModMail');

module.exports = async (client, message) => {
    return;
    if (message.author.bot) return;

    if (!isNaN(message.content)) return;

    if (client.openedTickets.has(message.author.id)) {
        if (client.openedTickets.get(message.author.id).isActive) return;
        return await message.channel.send('You already have an open ticket');
    }

    const staffGuild = client.guilds.cache.get(client.StaffServerId);
    const optGuild = client.guilds.cache.get(client.guildId);

    if (!(await confirmTicket(message, optGuild))) return;

    const ticket = new ModMail(client, message, staffGuild);
    client.openedTickets.set(message.author.id, ticket);

    const channel = await ticket.init();

    if (!channel) {
        await message.channel.send(
            'Something went wrong. Please reach out to a staff member directly.'
        );
        return client.openedTickets.delete(message.author.id);
    }

    const isAccepted = await ticket.isTicketAccepted();

    if (isAccepted === null) client.openedTickets.delete(message.author.id);
    else if (!isAccepted)
        setTimeout(() => {
            client.openedTickets.delete(message.author.id);
        }, 300000);

    const isClosed = await ticket.handleConvo();

    if (isClosed) {
        client.openedTickets.delete(message.author.id);
    }
};

const confirmTicket = async (message, guild) => {
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
            `__**Tickets are only for contacting staff about issues or questions concerning ${guild.name}.**__\n`,
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
                    title: 'Cancelled',
                    description: 'I have cancelled your ticket!',
                    timestamp: new Date(),
                    footer: {
                        text: guild.name,
                        icon_url: guild.iconURL({ dynamic: true }),
                    },
                },
            });

            return false;
        } else if (reaction.emoji.name === check) {
            await embedMessage.edit('', {
                embed: {
                    color: 0x00f763,
                    title: 'Ticket Opened',
                    description:
                        'I have submitted your ticket! Please wait while one of our staff members gets back to you.',
                    timestamp: new Date(),
                    footer: {
                        text: guild.name,
                        icon_url: guild.iconURL({ dynamic: true }),
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
                    text: guild.name,
                    icon_url: guild.iconURL({ dynamic: true }),
                },
            },
        });

        return false;
    }
};
