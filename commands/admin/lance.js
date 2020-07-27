module.exports = {
    name: 'lance',
    description: 'lance',
    adminOnly: true,
    category: 'admin',
    execute(message) {
        message.channel.send(
            'Go to your left, no your other left, no thats straight'
        );
    },
};
