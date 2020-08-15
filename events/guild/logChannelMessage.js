const punishments = ['WARN', 'MUTE', 'UNMUTE'];
const inviteLinkMsg = 'Posted an invite';

exports.readLogs = async (client, message) => {
    const logEmbed = message.embeds[0];
    if (!embed.author) return;

    const punishment = embed.author.name
        .split(' ')[0]
        .replace('[', '')
        .replace(']', '');

    if (!punishments.includes(punishment)) return;
};

const buildResponse = (member, name, description, fields, color = 0xff0000) => {
    return {
        color,
        author: {
            name,
            icon_url: member.user.displayAvatarURL(),
        },
        description,
        fields,
        timestamp: new Date(),
        footer: {
            text: member.guild.name,
        },
    };
};
