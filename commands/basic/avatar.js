module.exports = {
    name: 'avatar',
    description:
        'Get the avatar URL of the tagged user(s), or your own avatar.',
    aliases: ['icon', 'pfp', 'av'],
    usage: '<user>',
    category: 'basic',
    execute(message) {
        if (!message.mentions.users.size) {
            return message.channel.send({
                embed: {
                    title: `Your avatar avatar:`,
                    image: {
                        url: `${message.author.displayAvatarURL({
                            dynamic: true,
                        })}`,
                    },
                },
            });
        }

        message.mentions.users.forEach((user) => {
            message.channel.send({
                embed: {
                    title: `${user.username}'s avatar:`,
                    image: {
                        url: `${user.displayAvatarURL({ dynamic: true })}`,
                    },
                },
            });
        });
    },
};
