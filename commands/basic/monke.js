module.exports = {
    name: 'monke',
    description: "I'll tell you how monk you are",
    category: 'basic',
    execute(message) {
        const monkRating = Math.floor(Math.random() * 100) + 1 + '%';
        message.channel.send(`You are ${monkRating} monke`);
    },
};
