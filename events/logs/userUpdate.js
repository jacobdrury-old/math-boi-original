const { MessageEmbed } = require('discord.js');
const { getUserLogChannel } = require('../../modules/utils');

module.exports = async (client, oldUser, newUser) => {
    let updated = false;

    const webhookClient = await getUserLogChannel();
    if (!webhookClient) return;

    const embed = new MessageEmbed({
        color: 0xffa500,
        author: {
            name: `${newUser.username}#${newUser.discriminator}`,
            icon_url: newUser.displayAvatarURL({
                dynamic: true,
            }),
        },
        thumbnail: {
            url: newUser.displayAvatarURL({
                dynamic: true,
            }),
        },
        description: `**${newUser} updated their profile!**`,
        timestamp: new Date(),
    });

    //Check username
    if (oldUser.username !== newUser.username) {
        embed.addField(
            'Username',
            `\`${oldUser.username}\` -> \`${newUser.username}\``,
            false
        );
        updated = true;
    }

    //Check Discriminator
    if (oldUser.discriminator !== newUser.discriminator) {
        embed.addField(
            'Discriminator',
            `\`${oldUser.discriminator}\` -> \`${newUser.discriminator}\``,
            false
        );
        updated = true;
    }

    const oldUrl = oldUser.displayAvatarURL({
        dynamic: true,
    });

    const newUrl = newUser.displayAvatarURL({
        dynamic: true,
    });

    //Check Pfp
    if (oldUrl !== newUrl) {
        embed.addField(
            'Avatar',
            `[Before]${oldUrl} -> [After]${newUrl}`,
            false
        );
        updated = true;
    }

    if (updated) return await webhookClient.send({ embeds: [embed] });
};
