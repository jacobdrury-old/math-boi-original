const banGifs = [
    'https://tenor.com/view/ban-oprah-gif-10045949',
    'https://tenor.com/view/when-your-team-too-good-ban-salt-bae-gif-7580925',
    'https://tenor.com/view/ban-hammer-thor-mod-moderator-gif-13991887',
    'https://tenor.com/view/trump-donaldtrump-interview-banned-cnn-gif-7677105',
    'https://tenor.com/view/sao-liz-lisbeth-anime-ban-gif-14368031',
    //'https://tenor.com/view/flipping-off-flip-off-teich-middle-finger-fuck-off-fuck-you-gif-15587868',
    'https://tenor.com/view/banned-and-you-are-banned-explosion-yoshi-hammer-gif-17493177',
    'https://tenor.com/view/ban-nope-ban-for-life-you-you-guys-gif-16051005',
    'https://tenor.com/view/ban-anime-fight-battle-punch-gif-9720768',
    'https://tenor.com/view/hyper-ban-dragonite-ban-gif-9811324',
    'https://tenor.com/view/bongocat-banhammer-ban-hammer-bongo-gif-18219363',
    'https://tenor.com/view/ban-hammer-tcg-gif-11837323',
    'https://tenor.com/view/cat-kick-move-gif-14431990',
    'https://tenor.com/view/cosmic-ban-hammers-gif-20478007',
];

const kickGifs = [
    'https://tenor.com/view/asdf-kick-gif-11029651',
    'https://tenor.com/view/ninja-kick-die-pow-gif-13730734',
    'https://tenor.com/view/bette-midler-danny-devito-ex-husband-husband-ruthless-people-gif-14617447',
    'https://tenor.com/view/angry-birds-kick-gif-10212381',
    'https://tenor.com/view/bear-hug-wave-bye-gif-12388210',
    'https://tenor.com/view/lionking-throwing-offacliff-gif-5583349',
];

exports.handle = (message) => {
    const cmd = message.content.toLowerCase();
    if (cmd.startsWith('!ban')) {
        return message.channel.send(
            banGifs[Math.floor(Math.random() * banGifs.length)]
        );
    } else if (cmd.startsWith('!kick')) {
        return message.channel.send(
            kickGifs[Math.floor(Math.random() * kickGifs.length)]
        );
    }
};
