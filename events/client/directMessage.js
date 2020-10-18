const Ticket = require('../../classes/Ticket');
const openedTickets = new Map();

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!isNaN(message.content)) return;

    if (openedTickets.has(message.author.id)) {
        if (openedTickets.get(message.author.id).isActive) return;
        return await message.channel.send('You already have an open ticket');
    }

    message.channel.send('', {
        embed: {
            color: 0x00f763,
            title: 'Ticket Opened!',
            description:
                'Hello! We have received your message. Please wait while one of our staff members gets back to you.',
            thumbnail: {
                url: message.guild.iconURL({
                    dynamic: true,
                }),
            },
            timestamp: new Date(),
        },
    });

    const guild = client.guilds.cache.get(client.guildId);

    const ticket = new Ticket(client, message, guild);
    openedTickets.set(message.author.id, ticket);

    const channel = await ticket.init();

    if (!channel) {
        await message.channel.send(
            'Something went wrong. Please reach out to a staff member directly.'
        );
        return openedTickets.delete(message.author.id);
    }

    const isAccepted = await ticket.isTicketAccepted();

    if (isAccepted === null) openedTickets.delete(message.author.id);
    else if (!isAccepted)
        setTimeout(() => {
            openedTickets.delete(message.author.id);
        }, 300000);

    const isClosed = await ticket.handleConvo();

    if (isClosed) {
        openedTickets.delete(message.author.id);
    }
};
