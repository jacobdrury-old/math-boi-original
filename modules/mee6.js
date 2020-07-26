const punishments = ['WARN', 'MUTE', 'UNMUTE'];

exports.readLogs = async (client, message) => {
    const embed = message.embeds[0];
    const punishment = embed.author.name
        .split(' ')[0]
        .replace('[', '')
        .replace(']', '');

    if (!punishments.includes(punishment)) return;

    const userId = embed.fields[0].value.replace('<@', '').replace('>', '');
    const user = await message.guild.members.fetch(userId);

    if (punishment === 'WARN') {
        const reason = embed.fields[2].value;
        return user.send(`You have received a warning.\n**Reason:** ${reason}`);
    } else if (punishment === 'MUTE') {
        const reason = embed.fields[2].value;
        const duration = embed.fields[3].value;
        return user.send(
            `You have been muted.\n**Reason:** ${reason}\n**Duration:** ${duration}`
        );
    } else if (punishment === 'UNMUTE') {
        return user.send(`You have been unmuted!`);
    }
};
