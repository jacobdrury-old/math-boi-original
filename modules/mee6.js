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

exports.handle = async (client, message, permission) => {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift();
    console.log(args);
    console.log(commandName);
    // if (
    //     message.content.startsWith('!ban') &&
    //     (permission.isAdmin || permission.isModerator)
    // ) {
    //     return message.channel.send(
    //         banGifs[Math.floor(Math.random() * banGifs.length)]
    //     );
    // } else if (message.content.startsWith('!warn'))
};
