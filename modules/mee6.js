const punishments = ['WARN', 'MUTE', 'UNMUTE'];

exports.readLogs = async (client, message) => {
    const embed = message.embeds[0];
    const punishment = embed.author.name
        .split(' ')[0]
        .replace('[', '')
        .replace(']', '');

    if (!punishments.includes(punishment)) return;

    const memberId = embed.fields[0].value.replace('<@', '').replace('>', '');
    const member = await message.guild.members.fetch(memberId);

    return member.send('', { embed: getEmbed(member, punishment, embed) });
};

const getEmbed = (member, punishment, embed) => {
    let response = {};
    switch (punishment) {
        case 'WARN':
            response = {
                color: 0xffa500,
                author: {
                    name: `[WARNING] ${member.user.username}#${member.user.discriminator}.`,
                    icon_url: member.user.displayAvatarURL(),
                },
                description: `You have received a warning.`,
                fields: [{ name: 'Reason', value: embed.fields[2].value }],
                timestamp: new Date(),
                footer: {
                    text: member.guild.name,
                },
            };
            break;
        case 'MUTE':
            response = {
                color: 0xff0000,
                author: {
                    name: `[MUTED] ${member.user.username}#${member.user.discriminator}`,
                    icon_url: member.user.displayAvatarURL(),
                },
                description: `You have been muted.`,
                fields: [
                    { name: 'Reason', value: embed.fields[2].value },
                    {
                        name: 'Duration',
                        value: embed.fields[3].value || 'null',
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: member.guild.name,
                },
            };
            break;
        case 'UNMUTE':
            response = {
                color: 0x008000,
                author: {
                    name: `[UNMUTE] You have been unmuted!`,
                    icon_url: member.user.displayAvatarURL(),
                },
                timestamp: new Date(),
                footer: {
                    text: member.guild.name,
                },
            };
            break;
    }

    return response;
};
