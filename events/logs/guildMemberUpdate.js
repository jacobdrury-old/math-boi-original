const { MessageEmbed } = require('discord.js');
const { getUserLogChannel } = require('../../modules/utils');

module.exports = async (client, oldMember, newMember) => {
    const hadRole = oldMember.roles.cache.get(client.ids.roles.booster);

    const hasRole = newMember.roles.cache.get(client.ids.roles.booster);

    if (!hadRole && hasRole) {
        return newMember.guild.channels.cache
            .get(client.ids.channels.announcement)
            .send(`Thank you for boosting the server ${newMember}!!`);
    }

    const webhookClient = await getUserLogChannel();
    if (!webhookClient) return;

    const embed = new MessageEmbed({
        color: 0xffa500,
        author: {
            name: `${newMember.user.username}#${newMember.user.discriminator}`,
            icon_url: newMember.user.displayAvatarURL({
                dynamic: true,
            }),
        },
        thumbnail: {
            url: newMember.user.displayAvatarURL({
                dynamic: true,
            }),
        },
        description: `**${newMember} updated their profile!**`,
        timestamp: new Date(),
    });

    //Check username
    if (oldMember.user.username !== newMember.user.username) {
        embed.addField(
            'Username',
            `\`${oldMember.user.username}\` -> \`${newMember.user.username}\``,
            false
        );
    }
    //Check Discriminator
    if (oldMember.user.discriminator !== newMember.user.discriminator) {
        embed.addField(
            'Discriminator',
            `\`${oldMember.user.discriminator}\` -> \`${newMember.user.discriminator}\``,
            false
        );
    }

    //Check nickname
    if (oldMember.nickname !== newMember.nickname) {
        embed.addField(
            'Nickname',
            `\`${oldMember.nickname}\` -> \`${newMember.nickname}\``,
            false
        );
    }

    const oldUrl = oldMember.user.displayAvatarURL({
        dynamic: true,
    });

    const newUrl = newMember.user.displayAvatarURL({
        dynamic: true,
    });

    //Check Pfp
    if (oldUrl !== newUrl) {
        embed.addField(
            'Avatar',
            `[Before]${oldUrl} -> [After]${newUrl}`,
            false
        );
    }

    await webhookClient.send({ embeds: [embed] });
};
