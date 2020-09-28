module.exports = {
    name: 'kick',
    description: 'Kicks given user',
    moderatorOnly: true,
    category: 'moderation',
    guildOnly: true,
    args: true,
    async execute(message, args) {
        const [, ...reasonArray] = args;
        const reason = reasonArray.join(' ');
        const callingMember = message.member;
        const targetMember = message.mentions.members.first();

        if (!callingMember.hasPermission('KICK_MEMBERS'))
            return message.channel.send(
                `You don't have permission to use this command`
            );

        if (!message.guild.me.hasPermission('KICK_MEMBERS'))
            return message.channel.send(
                `I don't have permission to kick members`
            );

        if (!targetMember)
            return message.channel.send(`I cannot find that member`);

        if (
            targetMember.roles.highest.position >=
                callingMember.roles.highest.position &&
            callingMember.id !== message.guild.owner.id
        )
            return message.channel.send(
                `You do not have permission to kick this member`
            );

        if (callingMember.id === targetMember.id)
            return message.channel.send(`You cannot kick yourself`);

        if (!targetMember.kickable)
            return message.channel.send(`I cannot kick this user`);

        await message.channel.send('', {
            embed: {
                author: {
                    name: `${targetMember.user.username}#${targetMember.user.discriminator} has been kicked`,
                    icon_url: targetMember.user.displayAvatarURL({
                        dynamic: true,
                    }),
                },
                description: `**Reason:** ${reason}`,
            },
        });

        await targetMember.kick(reason);

        message.client.emit('kick', message.url, targetMember, callingMember);
    },
};
