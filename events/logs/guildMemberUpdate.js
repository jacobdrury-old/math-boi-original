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

    let updated = false;

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

    //Check nickname
    if (oldMember.nickname !== newMember.nickname) {
        embed.addField(
            'Nickname',
            `\`${oldMember.nickname}\` -> \`${newMember.nickname}\``,
            false
        );
        updated = true;
    }

    if (updated) return await webhookClient.send({ embeds: [embed] });
};
