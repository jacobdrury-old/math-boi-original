module.exports = {
    name: 'ping',
    description: 'Ping!',
    category: 'basic',
    execute(message) {
        message.channel.send('Pong.');
    },
};
