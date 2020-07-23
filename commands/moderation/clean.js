module.exports = {
    name: 'prune',
    description: 'Deletes the past 10 messages',
    usage: '<number of messages to delete>',
    aliases: ['clear', 'prune'],
    moderatorOnly: true,
    guildOnly: true,
    category: 'moderation',
    execute(message, args) {
        let amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            amount = 10;
        } else if (amount <= 1 || amount > 100) {
            return message.reply(
                'You need to input a number between 1 and 99.'
            );
        }

        message.channel.bulkDelete(amount, true).catch((err) => {
            console.error(err);
            message.channel.send(
                'There was an error trying to prune messages in this channel!'
            );
        });
    },
};
