const Ticket = require('../../classes/Ticket');
const openedTickets = new Map();

module.exports = async (client, message) => {
    if (message.author.bot) return;

    if (openedTickets.has(message.author.id)) {
        if (!openedTickets.get(message.author.id))
            return await message.channel.send(
                'You already have an open ticket'
            );
    }

    message.channel.send('', {
        embed: {
            color: 0x00f763,
            title: 'Ticket Opened!',
            description:
                'Hello! We have received your message. Please wait momentarily while one of our staff members gets back to you.',
        },
    });

    const guild = client.guilds.cache.get(client.guildId);

    const ticket = new Ticket(client, message, guild);
    openedTickets.set(message.author.id, false);

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
        }, 10000);

    openedTickets.get(message.author.id, true);
    await ticket.handleConvo();
};
