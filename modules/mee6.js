const banGifs = [
    'https://tenor.com/view/ban-oprah-gif-10045949',
    'https://tenor.com/view/when-your-team-too-good-ban-salt-bae-gif-7580925',
    'https://tenor.com/view/ban-hammer-thor-mod-moderator-gif-13991887',
    'https://tenor.com/view/trump-donaldtrump-interview-banned-cnn-gif-7677105',
    'https://tenor.com/view/sao-liz-lisbeth-anime-ban-gif-14368031',
    'https://tenor.com/view/flipping-off-flip-off-teich-middle-finger-fuck-off-fuck-you-gif-15587868',
    'https://tenor.com/view/banned-and-you-are-banned-explosion-yoshi-hammer-gif-17493177',
    'https://tenor.com/view/ban-nope-ban-for-life-you-you-guys-gif-16051005',
];
const prefix = '!';

exports.handle = async (client, message) => {
    const embed = message.embeds[0];
    const punishment = embed.author.name
        .split(' ')[0]
        .replace('[', '')
        .replace(']', '');

    const userId = embed.fields[0].value.replace('<@!', '').replace('>', '');
    const user = await message.guild.members.fetch(userId);

    if (punishment === 'WARN') {
        const reason = embed.fields[2].value;
        return user.send(`You have received a warning. **Reason:** ${reason}`);
    } else if (punishment === 'MUTE') {
        const reason = embed.fields[2].value;
        const duration = embed.fields[3].value;
        return user.send(
            `You have been muted. **Reason:** ${reason}\n**Duration:** ${duration}`
        );
    }

    // console.log(username);
    // console.log(embed.description);

    // return message.channel.send(
    //     `${username} has been warned; ${embed.description}`
    // );

    return;
    if (commandName === 'ban') {
        return message.channel.send(
            banGifs[Math.floor(Math.random() * banGifs.length)]
        );
    } else if (commandName === 'warn') {
        const rawId = args[0];
        const userId = rawId.replace('<@!', '').replace('>', '');
        const reason = args.shift().join(' ');

        const member = await message.guild.members.fetch(userId);
        const moderator = await message.guild.members.fetch(message.author.id);

        member.send('', {
            embed: {
                color: '0xFF0000',
                title: 'Warning',
                description:
                    `You have been given a warning by ${moderator.displayName}\n\n` +
                    `Reason: ${reason}`,
            },
        });
    }
};
