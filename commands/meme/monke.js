module.exports = {
    name: 'monke',
    description: "I'll tell you how monk you are",
    category: 'meme',
    execute(message) {
        const monkRating =
            message.author.id === '495365100837011456'
                ? '100%'
                : Math.floor(Math.random() * 100) + 1 + '%';
        message.channel.send(`You are ${monkRating} monke`);
    },
};
