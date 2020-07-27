module.exports = {
    name: 'lance',
    description: 'lance',
    moderatorOnly: true,
    category: 'moderator',
    execute(message) {
        message.channel.send(
            'Go to your left, no your other left, no thats straight'
        );
    },
};
