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
    //const args = message.content.slice(prefix.length).split(/ +/);
    //const commandName = args.shift();

    console.log(message.embeds.first());
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
